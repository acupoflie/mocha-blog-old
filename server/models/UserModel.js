import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = await mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        minlength: [3, 'Username must be greater than 3 characters.'],
        maxlength: [18, 'Username must be less than 18 characters.'],
        unique: [true, 'This username is taken, please choose another.'],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        validate: [validator.isEmail, 'Email is not valid.'],
        unique: [true, 'This email is already in use.'],
        lowercase: true
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true,
        minlength: [8, 'Password must be greater than 8 characters.'],
        maxlength: [128, 'Password must be less than 128 characters.'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        trim: true,
        validate: {
            validator: function(value) {
                return this.password === value
            },
            message: 'Passwords are not same.'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

const User = mongoose.model('User', userSchema);

export default User;