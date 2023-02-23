const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/users.controllers');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.post(
  '/',
  [
    check('name', 'Name should not be empty').not().isEmpty(),
    check('email', 'Email should not be empty').not().isEmpty(),
    check('url', 'Url should not be empty').not().isEmpty(),
    check('introduction', 'Introduction should not be empty').notEmpty(),
    check('introduction', 'Introduction should be max 200 characters').isLength(
      {
        max: 200,
      }
    ),
  ],
  userController.createUser
);

router.get('/:userId', userController.getUserById);

router.patch(
  '/:userId',
  [
    check('email', 'should be email type').optional().isEmail(),
    check('url').optional(),
    check(
      'introduction',
      'Introduction should be max 200 characters'
    ).optional(),
  ],
  userController.updateUserById
);

router.delete('/:userId', userController.deleteUserById);

module.exports = router;
