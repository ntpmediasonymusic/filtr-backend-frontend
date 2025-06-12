const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Filtr API",
      version: "1.0.0",
      description: "Documentación de la API Filtr (usuarios, auth, playlists)",
    },
    servers: [{ url: `http://localhost:${process.env.PORT}` }],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Descripción del error",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 123 },
            firstName: { type: "string", example: "Juan" },
            lastName: { type: "string", example: "Pérez" },
            email: {
              type: "string",
              format: "email",
              example: "juan@correo.com",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "1990-01-01",
            },
            phone: { type: "string", example: "5551234567" },
            country: { type: "string", example: "Costa Rica" },
            favoriteMethod: { type: "string", example: "Spotify Premium" },
            optInSony: { type: "boolean", example: true },
            optInFiltr: { type: "boolean", example: false },
            isVerified: { type: "boolean", example: true },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-07-01T12:34:56Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-07-15T08:30:00Z",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

module.exports = swaggerJSDoc(options);
