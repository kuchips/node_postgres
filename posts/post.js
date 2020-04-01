const requiredParam = require('../helpers/required-param')
const { InvalidPropertyError } = require('../helpers/errors')

function makePost (
  postInfo = requiredParam('postInfo')
) {
  const validPost = validate(postInfo)
  return Object.freeze(validPost)

  function validate ({
    customer_id = requiredParam('customer_id'),
    post_msg = requiredParam('post_msg'),
    post_status = requiredParam('post_status'),
    post_type = requiredParam('post_type'),
    media_url
  } = {}) {
    validatePosts(customer_id)
    validatePosts(post_msg)
    validatePosts(post_status)
    validatePosts(post_type)
    return {
      customer_id: customer_id,
      post_msg: post_msg,
      post_status: post_status,
      post_type: post_type,
      media_url: media_url
    }
  }

  function validatePosts (post_property) {
    if (!post_property) {
      throw new InvalidPropertyError(`${post_property} is required.`)
    }
  }
}

function makePatchPost (
  postInfo = requiredParam('postInfo')
) {
  const validPatchPost = validatePatch(postInfo)
  return Object.freeze(validPatchPost)

  function validatePatch (postInfo) {
    const postUpdatableCols = ['post_status', 'post_type']
    const values = {}

    postUpdatableCols.forEach((col) => {
      if (postInfo.hasOwnProperty(col)) values[col] = postInfo[col]
    })
    return values
  }
}

module.exports = { makePost, makePatchPost }
