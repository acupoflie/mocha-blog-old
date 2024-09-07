import User from "../models/UserModel.js";
import {signJWT, validPassword, genPassword} from '../utils/validPassAndSignJwt.js';
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError.js'
import crypto from 'crypto'
import sendMail from '../utils/nodemailer.js'

export const createUser = asyncErrorHandler(
    async function (req, res, next) {
        try {
            const newUser = await User.create(req.body)

            const token = signJWT(newUser._id);

            res.status(200).json({
                message: "success",
                data: {
                    user: newUser,
                    token
                }
            })
        } catch (err) {
            res.status(404).json({
                message: "fail",
                error: err
            })
        }
    }
)

export const login = asyncErrorHandler(
    async function (req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new CustomError('Email or password is empty.'))
        }

        const user = await User.findOne({ email }).select('+password +salt')
        if (!user) {
            return next(new CustomError('No such user with this email.'))
        }

        if (!(await user.comparePasswordInDB(password, user.password, user.salt))) {
            return next(new CustomError('Password is wrong'))
        }

        const token = signJWT(user._id)

        res.status(200).json({
            message: 'success',
            data: {
                user,
                token
            }
        })
    }
)

export const protect = asyncErrorHandler(
    async function (req, res, next) {
        // Getting token from header
        const testToken = req.headers.authorization;
        let token;
        if (testToken && testToken.startsWith('Bearer')) {
            token = testToken.split(' ')[1]
        }

        // Verifying token
        const decodedToken = await jwt.verify(token, process.env.SECRET_JWT)

        // Checking existence of user
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return next(new CustomError('User no exists anymore.'))
        }

        const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
        if(isPasswordChanged) {
            next(new CustomError('The password has changed. Please log in again.', 403))
        }

        req.user = user
        next()
    }
)


export const resetPasswordRequest = asyncErrorHandler(
    async function (req, res, next) {
        const email = req.body.email;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new CustomError('This user doesnt exists.', 404));
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        user.passwordResetToken = hashedToken;
        user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
        user.save({ validateBeforeSave: false })

        const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`

        const info = {
            email,
            message: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
        sendMail(info)

        res.status(200).json({
            status: 'success',
            message: 'Password reset link send to the email.'
        })
    }
)

export const resetPassword = asyncErrorHandler(
    async function (req, res, next) {
        const token = req.params.token
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpires: { $gt: Date.now() } })

        if (!user) {
            return next(new CustomError('Token has expired.', 400))
        }

        user.password = newPassword
        user.confirmPassword = confirmPassword
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.passwordChangedAt = Date.now()
        await user.save()

        res.status(200).json({
            status: 'success',
            message: 'Password has changed.'
        })
    }
)