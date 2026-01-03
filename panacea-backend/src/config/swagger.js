import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Panacea EMR API',
            version: '1.0.0',
            description: 'Enterprise Hospital Resource Management System API',
            contact: {
                name: 'Lead Developer', // Put your name here if you want
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development Server',
            },
            // We will add Production URL later (e.g. Render)
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Look for Swagger annotations in these files:
    apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;