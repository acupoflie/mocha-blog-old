import express from 'express';
import { protect } from '../controllers/authController.js';


const postRouter = express.Router();

postRouter.route('/posts/allPostsOfUser').get(protect)

export default postRouter;