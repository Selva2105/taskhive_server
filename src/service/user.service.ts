import type { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';

import CustomError from '@/error/CustomError';
import type { UserRepo } from '@/repositories/user.repo';
import { OTPUtils } from '@/utils/otpUtils';
import AccountVerification from '@/view/AccountVerification';

import type { ActivityLogService } from './activityLog.service';
import type { MailService } from './mail.service';
import type { StripeService } from './stripe.service';
import type TokenService from './token.service';

type SafeUser = Omit<
  User,
  | 'password'
  | 'emailVerificationOTP'
  | 'emailVerificationExpires'
  | 'userSettingsId'
  | 'stripe_customer_id'
  | 'avatar'
  | 'emailVerified'
>;

export class UserService {
  private userRepo: UserRepo;

  private stripeService: StripeService;

  private mailService: MailService;

  private activityLogService: ActivityLogService;

  private tokenService: TokenService;

  constructor(
    userRepo: UserRepo,
    stripeService: StripeService,
    mailService: MailService,
    activityLogService: ActivityLogService,
    tokenService: TokenService,
  ) {
    this.userRepo = userRepo;
    this.stripeService = stripeService;
    this.mailService = mailService;
    this.activityLogService = activityLogService;
    this.tokenService = tokenService;
  }

  async createUser(user: Prisma.UserCreateInput): Promise<SafeUser | null> {
    const existingUser = await this.userRepo.findUserByEmail(user.email);

    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Generate email verification token
    user.emailVerificationOTP = OTPUtils.generateOTP();
    user.emailVerificationExpires = new Date(Date.now() + 20 * 60 * 1000);

    const stripeCustomerId = await this.stripeService.findOrCreateCustomer(
      user.email,
      user.username,
    );

    const createdUser = await this.userRepo.createUser({
      ...user,
      password: hashedPassword,
      stripe_customer_id: stripeCustomerId,
    });

    if (createdUser) {
      const mailOptions = {
        from: process.env.ADMIN_MAILID || 'default-email@example.com',
        to: user.email,
        subject: 'Welcome to Shallbuy',
        html: AccountVerification({
          frontendUrl: `${process.env.FRONTEND_URL}/verify-user?id=${createdUser.id}`,
          username: createdUser.username,
          email: createdUser.email,
          otp: createdUser.emailVerificationOTP || '',
        }),
      };
      await this.mailService.sendMail(mailOptions);

      await this.activityLogService.createActivityLog({
        action: 'CREATE',
        actionType: 'USER',
        User: { connect: { id: createdUser.id } },
        color: '',
      });

      return createdUser;
    }

    return null;
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: User;
  }> {
    const existingUser = await this.userRepo.findUserByEmail(email);

    if (!existingUser) {
      throw new CustomError('User does not exist', 400);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new CustomError('Invalid password', 400);
    }

    const token = this.tokenService.signToken(existingUser.id);

    await this.userRepo.updateUser(existingUser.id, {
      lastLogin: new Date(),
    });

    return { token, user: existingUser };
  }

  async verifyUser(
    id: string,
    emailVerificationOTP: string,
  ): Promise<User | null> {
    const user = await this.userRepo.findUserById(id);

    if (!user) {
      throw new CustomError('User does not exist', 400);
    }
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      throw new CustomError('Verification token expired', 400);
    }

    if (user.emailVerificationOTP !== emailVerificationOTP) {
      throw new CustomError('Invalid verification token', 400);
    }

    await this.userRepo.updateUser(id, {
      emailVerified: true,
      emailVerificationOTP: null,
      emailVerificationExpires: null,
    });

    return user;
  }
}
