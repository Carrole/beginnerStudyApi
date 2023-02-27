const { validationResult } = require('express-validator');
const db = require('../models');
const HttpError = require('../utils/httpError');

const User = db.users;

const createUser = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Add single user'
  // #swagger.operationId = 'addUser'
  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UserCreate" },
            }
        }
    }
  */
  /* #swagger.responses[200] = {
        description: "Ok",
        content: {
            "application/json": {
                schema:{
                    $ref: "#/components/schemas/User"
                }
            }
        }
    }
*/
  // #swagger.responses[200] = { description: 'Ok' }
  // #swagger.responses[409] = { description: 'User with the provided email already exists' }
  // #swagger.responses[400] = { description: 'Invalid input' }
  // #swagger.responses[500] = { description: 'Something went wrong, please try again' }
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input', errors.array()[0].msg, 400));
  }
  const { name, email, url, introduction } = req.body;

  // email 중복확인
  let existingUser;
  try {
    existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new HttpError(
        'Duplicate email',
        'provided email already',
        409
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      'Sign up failed, please try again',
      err.message,
      500
    );
    return next(error);
  }

  let newUser;
  try {
    newUser = await User.create({ name, email, url, introduction });
  } catch (err) {
    const error = new HttpError(
      'Sign up failed, please try again',
      err.message,
      500
    );
    return next(error);
  }

  res.status(201).send(newUser);
};

const getAllUsers = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get all users'
  // #swagger.operationId = 'getUsers'
  /* #swagger.responses[200] = {
        description: "Ok",
        content: {
            "application/json": {
                schema:{
                    $ref: "#/components/schemas/User"
                }
            }
        }
    }
*/
  // #swagger.responses[200] = { description: 'Ok' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Something went wrong, please try again' }
  try {
    const users = await User.findAll({});
    return res.status(200).send(users);
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Get user by id'
  // #swagger.operationId = 'getUserById'
  /* #swagger.parameters['userId'] = {
          description: "user id",
          in: "path",
          required: true,
          type: "string",
  } */
  /* #swagger.responses[200] = {
          description: "Ok",
          content: {
              "application/json": {
                  schema:{
                      $ref: "#/components/schemas/User"
                  }
              }
          }
      }
  */
  // #swagger.responses[404] = { description: 'Could not find user with the provided id' }
  // #swagger.responses[500] = { description: 'Something went wrong, please try again' }
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new HttpError('User not found', undefined, 404);
      return next(error);
    }
    return res.status(200).send(user);
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    return next(error);
  }
};

const updateUserById = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = "Update user data. Put all 'customData' as whole if editing columns other than 'name'"
  // #swagger.operationId = 'updateUser'
  /* #swagger.parameters['userId'] = {
          description: "user id",
          in: "path",
          required: true,
          type: "string",
  } */
  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UserUpdate" },
            }
        }
    }
  */
  /* #swagger.responses[200] = {
          description: "Updated User",
          content: {
              "application/json": {
                  schema:{
                      $ref: "#/components/schemas/User"
                  }
              }
          }
      }
  */
  // #swagger.responses[404] = { description: 'Could not find user with the provided id' }
  // #swagger.responses[442] = { description: 'Invalid input' }
  // #swagger.responses[500] = { description: 'Something went wrong, please try again' }
  const { userId } = req.params;
  const { email, url, introduction } = req.body;
  const user = await User.findByPk(userId);
  try {
    if (!user) {
      const error = new HttpError('User not found', undefined, 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    return next(error);
  }

  const inputObj = {
    email,
    url,
    introduction,
  };

  Object.keys(inputObj).forEach(
    (k) => inputObj[k] === null && delete inputObj[k]
  );

  Object.keys(inputObj).forEach((k) => {
    user[k] = inputObj[k];
  });

  try {
    await user.save({ fields: Object.keys(inputObj) });
    await user.reload();
    return res.status(200).send(user);
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    return next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Soft delete user'
  /* #swagger.parameters['userId'] = {
          description: "user id",
          in: "path",
          required: true,
          type: "string",
  } */
  /* #swagger.responses[200] = {
          description: "Ok",
          content: {
              "application/json": {
                  schema:{
                      $ref: "#/components/schemas/User"
                  }
              }
          }
      }
  */
  // #swagger.responses[404] = { description: 'Could not find user with the provided id' }
  // #swagger.responses[500] = { description: 'Something went wrong, please try again' }
  const { userId } = req.params;
  const user = await User.findByPk(userId);
  try {
    if (!user) {
      const error = new HttpError('User not found', undefined, 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    return next(error);
  }

  try {
    await user.destroy();
    return res.status(200).send(user);
  } catch (err) {
    const error = new HttpError('something went wrong', undefined, 500);
    return next(error);
  }
};

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById;
