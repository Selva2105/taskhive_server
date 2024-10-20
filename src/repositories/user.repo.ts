import type { Prisma, PrismaClient } from '@prisma/client';

export class UserRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Find Functions
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
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
  async createUser(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...user,
        addresses: user.addresses
          ? {
              create: user.addresses as Prisma.AddressCreateWithoutUserInput,
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        countryCode: true,
        phoneNumber: true,
        stripe_customer_id: true,
        addresses: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        emailVerificationOTP: true,
        emailVerificationExpires: false,
        bio: true,
        password: false,
      },
    });
  }

  // Update Functions
  async updateUser(id: string, user: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }
}
