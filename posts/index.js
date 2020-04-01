// Import internal modules
const logger = require('../config/logger')
const postsModel = require('../models/index')
const makePostList = require('./post-list')
const makePostsEndpointHandler = require('./posts-endpoint')

// Database
const db = require('../db/index')

// Test Database Connectivity
db.authenticate()
  .then(() => logger.log('info', 'Database is up and running...'))
  .catch(err => logger.log('info', `Database Connection error : ${err}`))

const postList = makePostList({ postsModel })
const postsEndpointHandler = makePostsEndpointHandler({ postList })

module.exports = postsEndpointHandler
