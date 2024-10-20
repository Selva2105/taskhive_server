import type { NextFunction, Request, Response } from 'express';

import type { UserService } from '@/service/user.service';
import asyncErrorHandler from '@/utils/asyncErrorHandler';

// Define an interface for the address structure
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public createUser = asyncErrorHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const {
        username,
        email,
        password,
        fullName,
        countryCode,
        phoneNumber,
        addresses,
      } = req.body;

      const formattedAddresses = addresses.map((address: Address) => ({
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      }));

      const user = await this.userService.createUser({
        username,
        email,
        password,
        fullName,
        countryCode,
        phoneNumber,
        addresses: formattedAddresses,
        stripe_customer_id: '',
      });

      if (!user) {
        res.status(400).json({ message: 'Failed to create user' });
      }
      res.status(201).json(user);
    },
  );

  public loginUser = asyncErrorHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, password } = req.body;

      const user = await this.userService.loginUser(email, password);
      res.status(200).json(user);
    },
  );

  public verifyEmail = asyncErrorHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id, emailVerificationOTP } = req.body;

      const user = await this.userService.verifyUser(id, emailVerificationOTP);
      res.status(200).json(user);
    },
  );
}
