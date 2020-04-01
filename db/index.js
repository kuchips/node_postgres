// Import Environment Variables configuration file
require('dotenv').config()

// Import External packages
const Sequelize = require('sequelize')

module.exports = new Sequelize(
  process.env.PG_POSTS_DATABASE,
  process.env.PG_USER,
  process.env.PG_POSTS_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    define: {
      timestamps: false
    },

    // pool configuration used to pool database connections
    // max: Number of open connections
    // min: At a minimum, have zero open connections/maintain no minimum number of connections
    // acquire: The maximum time, in milliseconds, that pool will try to get connection before throwing error
    // idle: Remove a connection from the pool after the connection has been idle (not been used) for 10 seconds
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
