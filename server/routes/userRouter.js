import express from 'express';
import { getAllUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route('/users/allUsers').get(getAllUsers)

export default userRouter;
