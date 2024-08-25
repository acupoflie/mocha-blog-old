import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Must be an article.'],
        minlength: [2, 'Min. 2 character.'],
        maxlength: [18, 'Max. 18 character'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Write some content.'],
        trim: true,
        minlength: [1, 'Min. 1 character.'],
        maxlength: [2000, 'Max. 2000 character'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', postSchema);

export default Post;