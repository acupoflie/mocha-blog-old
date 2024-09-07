import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
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

const Like = mongoose.model('Like', likeSchema);

export default Like;