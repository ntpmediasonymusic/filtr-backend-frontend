const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Filtr API",
      version: "1.0.0",
      description: "Documentación de la API Filtr (usuarios, auth, playlists)",
    },
    servers: [{ url: "http://localhost:" + process.env.PORT }],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"], // ruta a comentarios JSDoc
};

module.exports = swaggerJSDoc(options);
