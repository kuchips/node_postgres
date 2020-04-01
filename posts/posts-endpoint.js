const makeHttpError = require('../helpers/http-error')
const errors = require('../helpers/errors')
const makePosts = require('./post')

module.exports = function makePostsEndpointHandler ({ postList }) {
  return async function handle (httpRequest) {
    switch (httpRequest.method) {
      case 'GET':
        return getPosts(httpRequest)

      case 'POST':
        return postPost(httpRequest)

      case 'PATCH':
        return patchPost(httpRequest)

      case 'DELETE':
        return deletePost(httpRequest)

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        })
    }
  }

  // Get all posts OR single post from the database
  async function getPosts (httpRequest) {
    const id = httpRequest.queryParams || {}
    const pagination = {}
    pagination.offset = id.offset || 0
    pagination.limit = id.limit || 100
    const orderby = id.orderby || 'ASC'

    const result = id.post_id
      ? await postList.findByPostId({ post_id: id.post_id })
      : id.customer_id
        ? await postList.findByCustomerId({ customer_id: id.customer_id, orderby: orderby })
        : id.search
          ? await postList.search({ search_term: id.search })
          : await postList.getPosts({ pagination })

    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      data: JSON.stringify(result)
    }
  }

  // Insert a single post into the database
  async function postPost (httpRequest) {
    let postInfo = httpRequest.body
    if (!postInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      })
    }

    if (typeof httpRequest.body === 'string') {
      try {
        postInfo = JSON.parse(postInfo)
      } catch (err) {
        return makeHttpError({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        })
      }
    }

    try {
      const post = makePosts.makePost(postInfo)
      const result = await postList.add(post)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      }
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof errors.UniqueConstraintError
            ? 409
            : e instanceof errors.InvalidPropertyError ||
              e instanceof errors.RequiredParameterError
              ? 400
              : 500
      })
    }
  }

  // Update a single post in the database
  async function patchPost (httpRequest) {
    const id = httpRequest.queryParams || {}
    const post_id = id.post_id

    let postInfo = httpRequest.body
    if (!postInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      })
    }

    if (typeof httpRequest.body === 'string') {
      try {
        postInfo = JSON.parse(postInfo)
      } catch (err) {
        return makeHttpError({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        })
      }
    }

    try {
      const values = makePosts.makePatchPost(postInfo)
      const result = await postList.update(post_id, values)
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      }
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof errors.UniqueConstraintError
            ? 409
            : e instanceof errors.InvalidPropertyError ||
              e instanceof errors.RequiredParameterError
              ? 400
              : 500
      })
    }
  }

  // Delete a single post from the database
  async function deletePost (httpRequest) {
    const id = httpRequest.queryParams || {}

    if (!id.post_id) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: 'post_id is required.'
      })
    }

    const result = await postList.remove({ post_id: id.post_id })

    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      data: JSON.stringify(result)
    }
  }
}
