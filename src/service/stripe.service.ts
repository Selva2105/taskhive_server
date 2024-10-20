import Stripe from 'stripe';

import type { StripeRepository } from '@/repositories/stripe.repo';

export class StripeService {
  private stripe: Stripe;

  private stripeRepository: StripeRepository;

  constructor(stripeRepository: StripeRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-09-30.acacia',
    });
    this.stripeRepository = stripeRepository;
  }

  getStripeInstance(): Stripe {
    return this.stripe;
  }

  // New method to find or create a customer
  async findOrCreateCustomer(email: string, name: string): Promise<string> {
    return this.stripeRepository.findOrCreateCustomer(email, name);
  }

  async createSession(
    priceId: string,
    userId: string,
    quantity: number = 1,
  ): Promise<string> {
    return this.stripeRepository.createSession(priceId, userId, quantity);
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    return this.stripeRepository.handleWebhookEvent(event);
  }

  async getSessionDetails(id: string): Promise<{
    subscription: Stripe.Subscription;
  }> {
    const session = await this.stripeRepository.getSessionDetails(id);

    const subscription = await this.stripeRepository.getSubscriptionDetails(
      session.subscription as string,
    );
    return { subscription } as { subscription: Stripe.Subscription };
  }
}
