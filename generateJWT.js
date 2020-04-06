// Import Environment Variables configuration file
require('dotenv').config()

// Import System packages
const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require('path')

// Local variables
const issuedAt = Math.floor(Date.now() / 1000);
const TOKEN_DURATION_IN_SECONDS = 3600;
const pathToKey = path.join(__dirname,  '/id_rsa_priv.pem');
const private_key = fs.readFileSync(pathToKey, 'utf8');

const params = {
    'iss': process.env.JWT_SUB,
    'sub': process.env.JWT_SUB,
    'aud': process.env.JWT_AUD,
    'iat': issuedAt,
    'exp': issuedAt + TOKEN_DURATION_IN_SECONDS,
};

const options = {
    algorithm: 'RS256',
    header: {
        'typ': 'JWT',
        'alg': 'RS256',
    },
};

const token = jwt.sign(params, private_key, options);
console.log(token);

function getToken() {
  return token
}

module.exports = { getToken }
