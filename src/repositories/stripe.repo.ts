/* eslint-disable @typescript-eslint/naming-convention */
import { type PrismaClient, TypeOfCharge } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';

import CustomError from '@/error/CustomError';

import type { UserRepo } from './user.repo';

type UpdateData = {
  [key: string]: any;
  theme_color?: string;
};

type EventData = {
  object: {
    default_price: string;
    [key: string]: any;
  };
};

type TData = EventData & Stripe.Event.Data;
export class StripeRepository {
  private prisma: PrismaClient;

  private stripe: Stripe;

  private userRepository: UserRepo;

  constructor(prismaClient: PrismaClient, userRepository: UserRepo) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-09-30.acacia',
    });
    this.prisma = prismaClient;
    this.userRepository = userRepository;
  }

  async findOrCreateCustomer(email: string, name: string): Promise<string> {
    const existingCustomers = await this.stripe.customers.list({
      email,
      limit: 1,
    });

    let stripeCustomerId: string;

    if (existingCustomers.data.length) {
      stripeCustomerId = existingCustomers?.data[0]?.id as string;
    } else {
      const { id: customerId } = await this.stripe.customers.create({
        email,
        name,
      });

      stripeCustomerId = customerId;
    }

    return stripeCustomerId;
  }

  async createSession(
    priceId: string,
    userId: string,
    quantity: number = 1,
  ): Promise<string> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      stripeCustomerId = await this.findOrCreateCustomer(
        user.email,
        user.username,
      );
      await this.userRepository.updateUser(userId, {
        stripe_customer_id: stripeCustomerId,
      });
    }

    const subscription = await this.prisma.subscriptions.findUnique({
      where: { price_id_stripe: priceId },
    });

    const coupons: string = subscription?.coupons[0] || '';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity }],
      customer: stripeCustomerId,
      success_url: `http://localhost:8282/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3000/cancel',
      currency: 'inr',
    };
    if (quantity === 12) {
      sessionParams.discounts = [
        {
          coupon: coupons,
        },
      ];
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    return session.url as string;
  }

  async getSessionDetails(id: string): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.retrieve(id);
    return session as Stripe.Checkout.Session;
  }

  async getSubscriptionDetails(id: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.retrieve(id);
    return subscription as Stripe.Subscription;
  }

  async handleProductUpdated(event: Stripe.Event): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { object, previous_attributes } = event.data as TData;

    const fieldMap: Record<string, string> = {
      active: 'is_active',
    };

    if (!previous_attributes) {
      return;
    }

    const updateData: UpdateData = {};

    for (const field of Object.keys(previous_attributes)) {
      if (
        field !== 'updated' &&
        field !== 'metadata' &&
        Object.prototype.hasOwnProperty.call(object, field)
      ) {
        const mappedField = fieldMap[field] || field;
        updateData[mappedField] = object[field];
      } else if (field === 'metadata') {
        updateData.theme_color = object[field].color_name;
      }
    }
    try {
      await this.prisma.subscriptions.update({
        where: { price_id_stripe: object.default_price },
        data: updateData,
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const newError = new CustomError(
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
      throw newError;
    }
  }

  async handleSubscriptionCreated(event: Stripe.Event): Promise<void> {
    const { customer, current_period_start, current_period_end, items } = event
      .data.object as Stripe.Subscription;
    const { plan, quantity } = items.data[0] as Stripe.SubscriptionItem;
    const currentPeriodStart = new Date(current_period_start * 1000);
    const currentPeriodEnd = new Date(current_period_end * 1000);

    const user = await this.userRepository.findUserByStripeId(
      customer.toString(),
    );

    const subscription = await this.prisma.subscriptions.findUnique({
      where: { price_id_stripe: plan.id },
    });

    if (user && subscription) {
      try {
        await this.prisma.userSubscriptions.create({
          data: {
            user_id: user.id,
            registration_date: currentPeriodStart,
            expires_at: currentPeriodEnd,
            user_stripe_customer_id: user.stripe_customer_id as string,
            subscription_id: subscription.id,
            type_of_charge:
              quantity === 12 ? TypeOfCharge.ANNUAL : TypeOfCharge.MONTHLY,
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const newError = new CustomError(
          errorMessage,
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
        throw newError;
      }
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'product.updated':
        return this.handleProductUpdated(event);

      case 'customer.subscription.created':
        return this.handleSubscriptionCreated(event);
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return Promise.resolve();
  }
}
