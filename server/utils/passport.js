import fs from 'fs';
import path from 'path';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/UserModel.js';

const PUB_KEY = fs.readFileSync('id_rsa_pub.pem', 'utf-8')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

export const jwtStrategy = new Strategy(options, (payload, done) => {
    User.findOne({_id: payload.sub})
        .then(user => {
            if(user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch(err => done(err, null))
})