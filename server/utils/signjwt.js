import jwt from 'jsonwebtoken'

export default function signJWT(id) {
    return jwt.sign({id}, process.env.SECRET_JWT, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}