import User from "../models/UserModel.js";
import signJWT from "../utils/signjwt.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from 'jsonwebtoken';
import CustomError from "../utils/CustomError.js";

export const createUser = asyncErrorHandler(
    async function(req, res, next) {
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
    async function(req, res, next) {
        const {email, password} = req.body;

        if(!email || !password) {
            return next(new CustomError('Email or password is empty.'))
        }

        const user = await User.findOne({email}).select('+password')
        if(!user) {
            return next(new CustomError('No such user with this email.'))
        }
        
        if(!(await user.comparePasswordInDB(password, user.password))) {
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
    async function(req, res, next) {
        // Getting token from header
        const testToken = req.headers.authorization;
        let token;
        if(testToken && testToken.startsWith('Bearer')) {
            token = testToken.split(' ')[1]
        }

        // Verifying token
        const decodedToken = await jwt.verify(token, process.env.SECRET_JWT)
        console.log(decodedToken)

        // Checking existence of user
        if(!(await User.findById(decodedToken.id))) {
            return next(new CustomError('User no exists anymore.'))
        }
        next()
    }
)