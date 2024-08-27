import express from 'express';
import { getAllUsers, updateMe, getUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route('/users/allUsers')
    .get(getAllUsers);

userRouter.route('/users/getUser/:id')
    .get(getUser)
    .patch(updateMe)

export default userRouter;
