// Import Environment Variables configuration file
require('dotenv').config()

// Import System packages
const express = require('express')
const cors = require('cors')
const passport = require('passport')

// Import internal modules
const logger = require('./config/logger')
const handlePostsRequest = require('./posts/index')
const adaptRequest = require('./helpers/adapt-request')

// Instantiate express module for https requests
const app = express()
// Use native express body parser instead of bodyParser library
app.use(express.json())
// Pass the global object into the passport configuration function
require('./config/passport')(passport);

// Initialize the passport object
app.use(passport.initialize())

// Declare variables
const port = process.env.EXPRESS_PORT || 5000

// Get JWT Token ** Only for testing purposes **
app.get('/getToken', (req,res) => {
  const acquireToken = require('./generateJWT')
  res.status(200).json({jwt:acquireToken.getToken()})
})

// Pass the basic CRUD routes to controller
app.get('/posts', handleAuthentication, postsController)
app.post('/posts', handleAuthentication, postsController)
app.patch('/posts', handleAuthentication, postsController)
app.delete('/posts', handleAuthentication, postsController)

// Controller to handle JWT authentication 
function handleAuthentication(req,res,next) {
  passport.authenticate('jwt',{session : false}, function(err,user,info) {
    // Generate a JSON response if an exception occurs
    if (err) {
      return res.send({ success : false, message : `${err}` })
    }
    // Generate a JSON response reflecting authentication status
    if (info) {
      return res.send({ success : false, message : `${info}` })
    }
    return next()
  })(req, res, next)
}

// Controller to handle the http requests
function postsController (req, res) {

  const httpRequest = adaptRequest(req)
  handlePostsRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res
        .set(headers)
        .status(statusCode)
        .send(data)
    )
    .catch(e => res.status(500).end())

}

// Listen requests on port
app.listen(port, () => {
  console.log(`posts service listening on port ${port}....`)
})
  .on('error', () => {
    logger.log('error', `Application ${process.env.APP} - error listening on port ${port}`)
  })
