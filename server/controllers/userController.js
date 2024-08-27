import User from "../models/UserModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const getAllUsers = asyncErrorHandler(
    async function(req, res, next) {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            count: users.length,
            data: {
                users
            }
        })
    }
)

export const getUser = asyncErrorHandler(
    async function(req, res, next) {
        const id = req.params.id
        const user = await User.findById(id)
        
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
)

export const updateMe = asyncErrorHandler(
    async function(req, res, next) {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
)
