// Import Environment Variables configuration file
require('dotenv').config()

// Import System packages
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Import internal modules
const logger = require('./config/logger')
const handlePostsRequest = require('./posts/index')
const adaptRequest = require('./helpers/adapt-request')

// Instantiate express module for https requests
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Pass the basic CRUD routes to controller
app.get('/posts', postsController)
app.post('/posts', postsController)
app.patch('/posts', postsController)
app.delete('/posts', postsController)

// Declare variables
const port = process.env.EXPRESS_PORT || 5000

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
    logger.log('error', `error listening posts service on port ${port}`)
  })
