import express from 'express';
import { protect } from '../controllers/authController.js';
import { createPost, editPost, deletePost, likePost } from '../controllers/postController.js';


const postRouter = express.Router();

postRouter.route('/posts')
    .post(protect, createPost)
    
postRouter.route('/posts/:postid')
    .patch(protect, editPost)
    .delete(protect, deletePost)

postRouter.route('/posts/like/:postid')
    .patch(protect, likePost)

export default postRouter;