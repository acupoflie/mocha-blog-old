import express from 'express';
import { protect } from '../controllers/authController.js';
import { createPost, editPost } from '../controllers/postController.js';


const postRouter = express.Router();

postRouter.route('/posts')
    .post(protect, createPost)
    
postRouter.route('/posts/:postid')
    .patch(protect, editPost)

export default postRouter;