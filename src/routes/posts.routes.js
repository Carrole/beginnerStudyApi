const express = require('express');
const { check } = require('express-validator');
const postController = require('../controllers/posts.controllers');

const router = express.Router();

router.get('/', postController.getAllPosts);

router.post(
  '/',
  [
    check('content', 'Content should not be empty').notEmpty(),
    check('content', 'Content should be max 200 characters').isLength({
      max: 200,
    }),
  ],
  postController.createPost
);

router.patch('/:postId', postController.updatePostById);

router.delete('/:postId', postController.deletePostById);

module.exports = router;
