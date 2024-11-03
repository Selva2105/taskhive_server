import type { Prisma, PrismaClient, User } from '@prisma/client';

type SafeUser = Omit<
  User,
  | 'password'
  | 'emailVerificationOTP'
  | 'emailVerificationExpires'
  | 'stripe_customer_id'
>;

export class UserRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Find Functions
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserByUsername(username: string): Promise<Boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return !user;
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByStripeId(stripeId: string) {
    return this.prisma.user.findUnique({
      where: { stripe_customer_id: stripeId },
    });
  }

  // Create Functions
  async createUser(user: Prisma.UserCreateInput): Promise<SafeUser> {
    return this.prisma.user.create({
      data: {
        ...user,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        countryCode: true,
        phoneNumber: true,
        companyName: true,
        stripe_customer_id: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        emailVerificationOTP: true,
        emailVerificationExpires: false,
        bio: true,
        password: false,
        settings: true,
        activityLog: true,
        avatar: true,
        emailVerified: true,
        userSettingsId: true,
      },
    });
  }

  async getUserFullInfo(id: string): Promise<SafeUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        companyName: true,
        countryCode: true,
        phoneNumber: true,
        stripe_customer_id: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        emailVerificationOTP: true,
        emailVerificationExpires: false,
        bio: true,
        password: false,
        settings: true,
        activityLog: true,
        avatar: true,
        emailVerified: true,
        userSettingsId: true,
        organizationMembers: true,
        ownedOrganizations: true,
        roles: true,
        tasks: true,
        UserSubscriptions: true,
      },
    });
  }

  // Update Functions
  async updateUser(
    id: string,
    user: Prisma.UserUpdateInput,
  ): Promise<SafeUser> {
    return this.prisma.user.update({
      where: { id },
      data: user,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        companyName: true,
        countryCode: true,
        phoneNumber: true,
        stripe_customer_id: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        emailVerificationOTP: true,
        emailVerificationExpires: false,
        bio: true,
        password: false,
        settings: true,
        activityLog: true,
        avatar: true,
        emailVerified: true,
        userSettingsId: true,
      },
    });
  }

  async deleteUser(id: string): Promise<SafeUser | null> {
    return this.prisma.$transaction(async (prisma) => {
      // Delete related records first
      await prisma.activityLog.deleteMany({
        where: { userId: id },
      });

      await prisma.userSubscriptions.deleteMany({
        where: { user_id: id },
      });

      await prisma.payment.deleteMany({
        where: { userId: id },
      });

      // Finally, delete the user
      return prisma.user.delete({
        where: { id },
      });
    });
  }
}
