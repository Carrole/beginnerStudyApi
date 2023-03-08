const { validationResult } = require('express-validator');
const db = require('../models');
const HttpError = require('../utils/httpError');

const User = db.users;
const Post = db.posts;

const createPost = async (req, res, next) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Add single Post'
  // #swagger.operationId = 'addPost'
  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/CreatePost" },
            }
        }
    }
  */
  /* #swagger.responses[200] = {
        description: "Ok",
        content: {
            "application/json": {
                schema:{
                    $ref: "#/components/schemas/Post"
                }
            }
        }
    }
*/
  // #swagger.responses[200] = { description: 'Ok' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[400] = { description: 'Invalid input' }
  // #swagger.responses[500] = { description: 'post registration failed, please try again' }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(400, 'Validation failed', { errors: errors.array() })
    );
  }
  const { userName, content, toUser } = req.body;

  let user;
  try {
    user = await User.findOne({ where: { name: userName } });
    if (!user) {
      const error = new HttpError('User not found', 'non-existent user', 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      'post registration failed, please try again',
      err.message,
      500
    );
    return next(error);
  }

  let newPost;
  try {
    newPost = await Post.create({ userId: user.id, content, toUser });
  } catch (err) {
    const error = new HttpError(
      'post registration failed, please try again',
      err.message,
      500
    );
    return next(error);
  }

  res.status(201).send(newPost);
};

const getAllPosts = async (req, res, next) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Get all Posts'
  // #swagger.operationId = 'getAllPosts'
  /* #swagger.parameters['toUser'] = {
        description: "toUser",
        in: "path",
        required: true,
        type: "string",
} */
  /* #swagger.responses[200] = {
        description: "Ok",
        content: {
            "application/json": {
                schema:{
                    $ref: "#/components/schemas/Post"
                }
            }
        }
    }
*/
  /* #swagger.responses[200] = { description: 'Ok' }
  #swagger.responses[404] = { description: 'no posts found' }
  #swagger.responses[500] = { description: 'Something went wrong, please try again' }
  */
  const { toUser } = req.query;

  let posts;
  if (toUser) {
    try {
      posts = await Post.findAll({
        where: { toUser },
        include: { model: User, as: 'user' },
      });
      if (!posts || posts.length === 0) {
        const error = new HttpError('no posts found', undefined, 404);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError('something went wrong', err.message, 500);
      return next(error);
    }
  } else {
    try {
      posts = await Post.findAll({ include: { model: User, as: 'user' } });
    } catch (err) {
      const error = new HttpError('something went wrong', err.message, 500);
      return next(error);
    }
  }

  res.status(200).send(posts);
};

const updatePostById = async (req, res, next) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Update single Post'
  // #swagger.operationId = 'updatePostById'
  /* #swagger.parameters['postId'] = {
      description: "postId",
      in: "path",
      required: true,
      type: "string",
} */
  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UpdatePost" },
            }
        }
    }
  */
  /* #swagger.responses[200] = {
        description: "Ok",
        content: {
            "application/json": {
                schema:{
                    $ref: "#/components/schemas/Post"
                }
            }
        }
    }
*/
  // #swagger.responses[200] = { description: 'Ok' }
  // #swagger.responses[404] = { description: 'Post not found' }
  // #swagger.responses[500] = { description: 'post registration failed, please try again' }
  const errors = validationResult(req);
  const { postId } = req.params;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return next(new HttpError(404, 'Post not found'));
    }
    await post.update(req.body);
    res.status(200).send(post);
  } catch (error) {
    next(error);
  }
};

const deletePostById = async (req, res, next) => {
  // #swagger.tags = ['Post']
  // #swagger.summary = 'Soft delete post'
  /* #swagger.parameters['postId'] = {
          description: "post id",
          in: "path",
          required: true,
          type: "string",
  } */
  /* #swagger.responses[200] = {
          description: "Ok",
          content: {
              "application/json": {
                  schema:{
                      $ref: "#/components/schemas/Post"
                  }
              }
          }
      }
  */
  // #swagger.responses[404] = { description: 'Could not find post with the provided id' }
  // #swagger.responses[500] = { description: 'Something went wrong, please try again' }

  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      const error = new HttpError('Post not found', undefined, 404);
      return next(error);
    }
    await post.destroy();
    res.status(200).send(post);
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    next(error);
  }
};

exports.createPost = createPost;
exports.getAllPosts = getAllPosts;
exports.updatePostById = updatePostById;
exports.deletePostById = deletePostById;
