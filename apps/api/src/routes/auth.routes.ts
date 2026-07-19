import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginBodySchema } from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginBodySchema), asyncHandler(authController.login));
authRouter.post('/refresh', asyncHandler(authController.refresh));
authRouter.post('/logout', asyncHandler(authController.logout));
authRouter.get('/me', authenticate, asyncHandler(authController.me));
