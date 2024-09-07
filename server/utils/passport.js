import fs from 'fs';
import path from 'path';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/UserModel.js';
import CustomError from './CustomError.js';

const PUB_KEY = fs.readFileSync('id_rsa_pub.pem', 'utf-8')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

const jwtStrategy = new Strategy(options, (payload, done) => {
    console.log(payload.sub)
    User.findOne({_id: payload.sub})
        .then(user => {
            if(user) {
                user.isPasswordChanged(payload.iat).then(isPasswordChanged => {
                    if(isPasswordChanged) {
                        const err = new CustomError('The password has changed. Please log in again.', 403)
                        return done(err, false)
                    } else {
                        return done(null, user)
                    }
                })
            } else {
                return done(null, false)
            }
        })
        .catch(err => done(err, null))
})

export default (passport) => {
    passport.use(jwtStrategy)
}