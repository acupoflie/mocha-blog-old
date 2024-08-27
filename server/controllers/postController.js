import Post from "../models/PostModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";

export const createPost = asyncErrorHandler(
    async function(req, res, next) {
        const {title, content} = req.body;

        const postBody = Object.assign(req.body, {author: req.user.id})
        const post = await Post.create(postBody);

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

        const updatedPost = await post.updateOne(req.body, {new: true, runValidators: true})

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        })
    }
)