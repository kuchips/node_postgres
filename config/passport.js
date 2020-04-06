// Import internal modules
const fs = require('fs')
const path = require('path')
const logger = require('./logger')

// Use the passport JWT strategy for authentication
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
// Module to extract the JWT from the http request
const ExtractJwt = passportJWT.ExtractJwt

// Declare variables
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'] 
}

const strategy = new JwtStrategy(options, (payload,next) => {
    if (payload.sub) {
      return next(null,payload)
    } else {
      logger.log('error',err)
      return next(err,null)
    }
})

module.exports = (passport) => {
  passport.use(strategy)
}