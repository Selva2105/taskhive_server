import type { NextFunction, Request, Response } from 'express';

import type { UserService } from '@/service/user.service';
import asyncErrorHandler from '@/utils/asyncErrorHandler';

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
        companyName,
      } = req.body;

      const user = await this.userService.createUser({
        username,
        email,
        password,
        fullName,
        countryCode,
        phoneNumber,
        companyName,
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

  public getUser = asyncErrorHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const user = await this.userService.getUser(id || '');
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

  public getValidUserName = asyncErrorHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { username } = req.params;
      const isValid = await this.userService.getValidUserName(username || '');
      res.status(200).json({ isValid });
    },
  );

  public deleteUser = asyncErrorHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      await this.userService.deleteUser(id || '');
      res.status(200).json({ message: 'User deleted successfully' });
    },
  );
}
