const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const playlistRoutes = require("./routes/playlist.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const path = require("path");

require("dotenv").config();
require("./models"); // inicializa DB

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/users", playlistRoutes); // endpoints de playlists anidados bajo /users/:userId
app.use("/api", spotifyRoutes);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "connect-src 'self' https://accounts.spotify.com https://api.spotify.com",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: https://cdn.wyng.com",
      "script-src 'self' https://cdn.wyng.com",
    ].join("; ")
  );
  next();
});

// Servir frontend React build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
// Para rutas que no sean API o auth o users, devolver index.html (React router)
app.get(/^\/(?!api|auth|users).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
