const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = function makePostList ({ postsModel }) {
  return Object.freeze({
    getPosts,
    findByPostId,
    findByCustomerId,
    add,
    update,
    remove,
    search
  })

  // Retrieve all posts
  async function getPosts ({ pagination }) {
    return postsModel.findAll({ offset: +pagination.offset, limit: +pagination.limit })
      .then(posts => {
      // console.log(posts)
        return posts
      })
      .catch(err => {
        return { error: `Error getting posts : ${err}` }
      })
  }

  // Retrieve the post by post_id
  async function findByPostId ({ post_id }) {
    return postsModel.findAll({ where: { post_id: +post_id } })
      .then(posts => {
        return posts
      })
      .catch(err => {
        return { error: `Error getting posts : ${err}` }
      })
  }

  // Retrieve all the posts of a customer
  async function findByCustomerId ({ customer_id, orderby }) {
    return postsModel.findAll({
      where: { customer_id: +customer_id },
      order: [['added_ts', orderby]]
    })
      .then(posts => {
        return posts
      })
      .catch(err => {
        return { error: `Error getting posts : ${err}` }
      })
  }

  // Insert a post into the database
  async function add ({ ...post }) {
    return postsModel.create({
      customer_id: post.customer_id,
      post_msg: post.post_msg,
      post_status: post.post_status,
      post_type: post.post_type,
      media_url: post.media_url
    })
      .then(post => {
        return {
          success: `Post ${post.post_id} inserted successfully!`,
          post: post
        }
      })
      .catch(err => {
        return { error: `Error adding Post : ${err}` }
      })
  }

  // Update a post in the database
  async function update (post_id, values) {
    return postsModel.update(
      values,
      {
        where: { post_id: +post_id }
      }
    )
      .then(rowsUpdated => {
        return {
          success: `Post ${post_id} update successfully!`,
          postsUpdated: rowsUpdated[0]
        }
      })
      .catch(err => {
        return { error: `Error adding Post : ${err}` }
      })
  }

  // Delete a single post from the database
  async function remove ({ post_id }) {
    return postsModel.destroy({
      where: {
        post_id: +post_id
      }
    })
      .then((rowsDeleted) => {
        return {
          success: `Post ${post_id} deleted successfully!`,
          postsDeleted: rowsDeleted
        }
      })
      .catch(err => {
        return { error: `Error deleting Post : ${err}` }
      })
  }

  // Search for a string
  async function search ({ search_term }) {
    return postsModel.findAll({ where: { post_msg: { [Op.like]: '%' + search_term + '%' } } })
      .then(posts => {
        return posts
      })
      .catch(err => {
        return { error: `Error searching posts : ${err}` }
      })
  }
}
