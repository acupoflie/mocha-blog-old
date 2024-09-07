import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { genPassword, validPassword } from '../utils/validPassAndSignJwt.js'

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
    bio: {
        type: String,
        maxlength: [150, 'Max char for bio is 150.'],
        trim: true
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password is required.'],
        trim: true,
        minlength: [8, 'Password must be greater than 8 characters.'],
        maxlength: [128, 'Password must be less than 128 characters.']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        trim: true,
        validate: {
            validator: function (value) {
                return this.password === value
            },
            message: 'Passwords are not same.'
        }
    },
    salt:{
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
},
{
    toObject: {useProjection: true},
    toJSON: {useProjection: true}
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    const hashSalt = genPassword(this.password);

    this.password = hashSalt.hash
    this.salt = hashSalt.salt
    this.confirmPassword = undefined
    next()
})

// TODO
userSchema.methods.comparePasswordInDB = async function (password, hash, salt) {
    return validPassword(password, hash, salt)
}

userSchema.methods.isAdmin = async function (role) {
    return role === this.role
}

userSchema.methods.isPasswordChanged = async function (iat) {
    if (this.passwordChangedAt) {
        const passwordChangedAtTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return iat < passwordChangedAtTimestamp
    }
    return false
}

const User = mongoose.model('User', userSchema);

export default User;