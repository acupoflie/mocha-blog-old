import express from 'express';
import { createUser, login } from '../controllers/authController.js';
import { resetPasswordRequest, resetPassword } from '../controllers/authController.js';
import passport from 'passport'
import { protect } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.route('/auth/signup').post(createUser);
authRouter.route('/auth/login').post(login)
authRouter.route('/auth/resetPasswordRequest').post(resetPasswordRequest)
authRouter.route('/auth/resetPassword/:token').post(resetPassword)

export default authRouter;