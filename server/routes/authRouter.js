import express from 'express';
import { createUser, login } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.route('/auth/signup').post(createUser);
authRouter.route('/auth/login').post(login)

export default authRouter;