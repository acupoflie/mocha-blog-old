import express from 'express';
import { createUser } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.route('/auth/users').post(createUser);

export default authRouter;