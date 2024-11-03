import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { UserController } from '@/controller/user.controller';
import { ActivityLogRepo } from '@/repositories/activityLog.repo';
import { StripeRepository } from '@/repositories/stripe.repo';
import { UserRepo } from '@/repositories/user.repo';
import { ActivityLogService } from '@/service/activityLog.service';
import { MailService } from '@/service/mail.service';
import { StripeService } from '@/service/stripe.service';
import TokenService from '@/service/token.service';
import { UserService } from '@/service/user.service';
import { createUserValidator } from '@/validators/user.validator';

const userRouter = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepo(prisma);
const stripeRepository = new StripeRepository(prisma, userRepository);
const stripeService = new StripeService(stripeRepository);
const mailService = new MailService();
const activityLogRepo = new ActivityLogRepo(prisma);
const activityLogService = new ActivityLogService(activityLogRepo);
const tokenService = new TokenService();
const userService = new UserService(
  userRepository,
  stripeService,
  mailService,
  activityLogService,
  tokenService,
);
const userController = new UserController(userService);

// GET ROUTES
userRouter.get('/validate/:username', userController.getValidUserName);
userRouter.get('/:id', userController.getUser);

// POST ROUTES
userRouter.post('/create', createUserValidator, userController.createUser);
userRouter.post('/login', userController.loginUser);

// PATCH ROUTES
userRouter.patch('/verify-email', userController.verifyEmail);

// DELETE ROUTES
userRouter.delete('/delete/:id', userController.deleteUser);

export default userRouter;
