const Sequelize = require('sequelize')
const db = require('../db/index')

const posts = db.define('posts', {
  post_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: Sequelize.STRING
  },
  post_msg: {
    type: Sequelize.STRING
  },
  post_status: {
    type: Sequelize.STRING
  },
  post_type: {
    type: Sequelize.STRING
  },
  media_url: {
    type: Sequelize.STRING
  },
  added_ts: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
})

module.exports = posts
