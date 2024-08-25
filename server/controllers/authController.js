import User from "../models/UserModel.js";

export async function createUser(req, res) {
    try {
        const newUser = await User.create(req.body)

        res.status(200).json({
            message: "success",
            data: {
                user: newUser
            }
        })
    } catch(err) {
        res.status(404).json({
            message: "fail",
            error: err
        })
    }
}