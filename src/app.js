const express = require('express');
require('dotenv').config();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const db = require('./models');
const userRoutes = require('./routes/users.routes');
const postRoutes = require('./routes/posts.routes');
const HttpError = require('./utils/httpError');
const swaggerFile = require('./swagger/swagger-output.json');

const { PORT } = process.env;

const port = PORT || 4000;

const app = express();

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:5501'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  res.send('hello world');
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 404 Error Handling
app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', undefined, 404);
});

// 500 Error Handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unknown error occurred!',
    cause: error.cause,
    code: error.code,
  });
});

app.listen(port, () => {
  console.log('now listening on port 4000');
});
