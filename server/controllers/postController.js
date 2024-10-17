import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import Like from "../models/PostLikeModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";
import Comment from "../models/PostCommentModel.js";

export const getUserPosts = asyncErrorHandler(
    async function(req, res, next) {
        const username = req.params.username;
        const user = await User.findOne({username}).lean().populate('posts').exec();
        if(!user) {
            return res.status(404).json({
                status: "User does not exists"
            })
        }

        res.status(200).json({
            status: "success",
            data: {
                length: user.posts.length,
                data: {
                    posts: user.posts
                }
            }
        })
    }
)

export const createPost = asyncErrorHandler(
    async function(req, res, next) {
        const postBody = Object.assign(req.body, {author: req.user.id})
        const post = await Post.create(postBody);

        req.user.posts.push(post);
        req.user.save({validateBeforeSave: false})

        res.status(200).json({
            status: 'message',
            data: {
                post
            }
        })
    }
)

export const editPost = asyncErrorHandler(
    async function(req, res, next) {
        const postId = req.params.postid
        const post = await Post.findById(postId);
        if(!post.author.equals(req.user.id)) {
            return next(new CustomError('You cant edit post which is not yours.'))
        }
        const updateBody = Object.assign(req.body, {updatedAt: Date.now()})
        const updatedPost = await post.updateOne(updateBody, {new: true, runValidators: true})

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        })
    }
)

export const deletePost = asyncErrorHandler(
    async function(req, res, next) {
        const postId = req.params.postid

        const post = await Post.findById(postId)
        if(!post.author.equals(req.user.id)) {
            return next(new CustomError('You dont have permission to delete this post.', 403))
        }

        await Post.findByIdAndDelete(postId)
        await User.findByIdAndUpdate(post.author, {$pull: {posts: postId}})

        res.status(204).json({
            status: 'success'
        })
    }
)

export const likePost = asyncErrorHandler(
    async function(req, res, next) {
        const postId = req.params.postid

        const existingLike = await Like.findOne({user: req.user.id, post: postId})
        if(existingLike) {
            await Like.findOneAndDelete({user: req.user.id, post: postId})
            await Post.findByIdAndUpdate(postId, {$inc: {totalLikes: -1}})
            res.status(200).json({
                status: 'you unliked this post'
            })
        } else {
            await Like.create({user: req.user.id, post: postId})
            await Post.findByIdAndUpdate(postId, {$inc: {totalLikes: 1}})
            res.status(200).json({
                status: 'you liked the post'
            })
        }
    }
)

export const commentPost = asyncErrorHandler(
    async function(req, res, next) {
        const comment = await Comment.create(Object.assign(req.body, req.user.id));
        await User.findByIdAndUpdate(req.user.id, {$push: {comments: comment.id}})
        await Post.findByIdAndUpdate(req.params.postid, {$push: {comments: comment.id}, $inc: {totalComments: 1}})
        res.status(201).json({
            status: "success",
            data: {
                comment
            }
        })
    }
)
