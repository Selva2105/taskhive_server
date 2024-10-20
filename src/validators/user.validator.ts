import { z } from 'zod';

import { validateRequest } from '@/error/Validation';

const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one symbol' }),
  fullName: z.string().min(1, { message: 'Full name is required' }),
  countryCode: z.string().min(1, { message: 'Country code is required' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  addresses: z.array(
    z.object({
      street: z.string().min(1, { message: 'Street is required' }),
      city: z.string().min(1, { message: 'City is required' }),
      state: z.string().min(1, { message: 'State is required' }),
      postalCode: z.string().min(1, { message: 'Postal code is required' }),
      country: z.string().min(1, { message: 'Country is required' }),
    }),
  ),
});

export const createUserValidator = validateRequest({
  body: createUserSchema,
});
