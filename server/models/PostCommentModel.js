import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: [200, 'Max length of content can not be more than 200 chars']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;