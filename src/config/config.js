require('dotenv').config();

const {
  DB_PASSWORD,
  DB_USER,
  DB_NAME,
  DB_PASSWORD_DEV,
  DB_NAME_DEV,
  DB_USER_DEV,
  DB_HOST_DEV,
  DB_HOST,
} = process.env;

const development = {
  username: DB_USER_DEV,
  password: DB_PASSWORD_DEV,
  database: DB_NAME_DEV,
  host: DB_HOST_DEV,
  dialect: 'mysql',
};

const production = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: 'mysql',
};

module.exports = {
  development,
  production,
};
