import express from 'express';
import { protect } from '../controllers/authController.js';
import { createPost, editPost, deletePost, likePost, commentPost, getUserPosts } from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.route('/posts/:username')
    .get(getUserPosts)

postRouter.route('/posts')
    .post(protect, createPost)
    
postRouter.route('/posts/:postid')
    .patch(protect, editPost)
    .delete(protect, deletePost)

postRouter.route('/posts/like/:postid')
    .patch(protect, likePost)

postRouter.route('/posts/comment/:postid')
    .patch(protect, commentPost)

export default postRouter;