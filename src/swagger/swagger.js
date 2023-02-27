const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const options = {
  info: {
    title: 'Beginner DB CRUD API',
    description: 'Beginner Study Api 연결 연습을 위한 API입니다 :)',
  },
  servers: [
    {
      url: 'http://localhost:4000',
    },
  ],
  schemes: ['http'],
  tags: [
    {
      name: 'User',
      description: 'Managing users',
    },
    {
      name: 'Post',
      description: 'Managing posts',
    },
  ],
  components: {
    schemas: {
      User: {
        id: {
          type: 'integer',
        },
        name: {
          type: 'string',
          required: true,
        },
        email: {
          type: 'string',
          required: true,
        },
        url: {
          type: 'string',
          required: true,
        },
        introduction: {
          type: 'string',
          required: true,
          maxLength: 200,
        },
      },
      UserCreate: {
        name: {
          type: 'string',
          required: true,
        },
        email: {
          type: 'string',
          required: true,
        },
        url: {
          type: 'string',
          required: true,
        },
        introduction: {
          type: 'string',
          required: true,
          maxLength: 200,
        },
      },
      UserUpdate: {
        email: {
          type: 'string',
          required: true,
        },
        url: {
          type: 'string',
          required: true,
        },
        introduction: {
          type: 'string',
          required: true,
          maxLength: 200,
        },
      },
      Post: {
        id: {
          type: 'integer',
        },
        content: {
          type: 'string',
          required: true,
        },
        userId: {
          type: 'integer',
          required: true,
        },
        toUser: {
          type: 'string',
          required: true,
        },
      },
      CreatePost: {
        userName: {
          type: 'string',
          required: true,
        },
        content: {
          type: 'string',
          required: true,
        },
        toUser: {
          type: 'string',
          required: true,
        },
      },
      UpdatePost: {
        content: {
          type: 'string',
          required: true,
        },
      },
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
  },
};

const outputFile = 'src/swagger/swagger-output.json';
const endpointsFiles = ['src/app.js'];
swaggerAutogen(outputFile, endpointsFiles, options);
