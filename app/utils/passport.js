const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').User;
const config = require('../../envConfig')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

/**
 * passport config
 * @param {*} passport 
 */
module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findByPk(jwt_payload.id)
      .then(user => done(null, user))
      .catch(err => done(err, false));
  }));
};
