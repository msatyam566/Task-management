const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');  // Added swagger-ui-express for serving docs
const http = require('http'); // Import the HTTP module to create the server
require('dotenv').config();

const app = express();
const port = process.env.PORT || 2000;

// Create an HTTP server instance using Express
const server = http.createServer(app);

// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000', // Replace with your allowed origin
    'http://localhost:2000',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Swagger Definition and Options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Specifies OpenAPI version 3.0.0
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'A simple Task Management API with user roles and notifications',
            contact: {
                name: 'Sam',
                email: 'your-email@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:2000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'Bearer',
                bearerFormat: 'JWT', // Optional, but helps to specify that it's a JWT token
              }
            }
          },
          security: [{
            bearerAuth: [] // Apply bearerAuth globally to all endpoints
          }]
    },
    apis: ['./routes/*.js'] // Path to the API docs in the routes folder
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint for accessing the docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const appRoutes = require('./routes/app.routes');
app.use('/api', appRoutes);

// Connect to MongoDB and start the server
mongoose.connect("mongodb+srv://satyam28147:bmd6WzxcwS9yw3Kb@cluster0.q43lt.mongodb.net/", 
).then(() => {
    console.log('MongoDB connected');

    // Start the server using the HTTP server instance
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
}).catch(err => {
    console.error('Database connection error:', err);
});
