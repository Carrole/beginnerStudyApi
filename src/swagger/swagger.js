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
        },
        email: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        introduction: {
          type: 'string',
        },
      },
      CreateUser: {
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
      UpdateUser: {
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
        userId: {
          type: 'integer',
        },
        content: {
          type: 'string',
        },
        toUser: {
          type: 'string',
        },
        updatedAt: {
          type: 'datetime',
        },
        createdAt: {
          type: 'datetime',
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
