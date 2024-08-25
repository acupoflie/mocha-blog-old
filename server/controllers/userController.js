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

export const deleteUser = asyncErrorHandler(
    async function(req, res, next) {
        const id = req.params.id;

    }
)