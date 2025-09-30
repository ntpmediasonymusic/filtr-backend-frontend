const express = require("express");
const path = require("path");
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

require("dotenv").config();
require("./models"); // inicializa DB

const app = express();
app.use(express.static(path.join(__dirname, "public")));

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
      // Política base
      "default-src 'self'",

      // JS: self, tu CDN, GTM/GA y Hotjar (+ inline si lo necesitas)
      "script-src 'self' https://cdn.wyng.com https://www.googletagmanager.com https://www.google-analytics.com https://static.hotjar.com https://script.hotjar.com 'unsafe-inline'",

      // Conexiones XHR/Fetch/WebSocket: APIs propias + Hotjar (.com y .io) + GA/GTM
      "connect-src 'self' https://accounts.spotify.com https://api.spotify.com https://www.google-analytics.com https://www.googletagmanager.com https://*.hotjar.com wss://*.hotjar.com https://*.hotjar.io wss://*.hotjar.io https://content.hotjar.io",

      // Estilos (banner, etc.)
      "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",

      // Fuentes
      "font-src 'self' https://fonts.gstatic.com",

      // Imágenes (incluye Hotjar, data: y blob:)
      "img-src 'self' https://cdn.wyng.com https://*.hotjar.com https://*.hotjar.io data: blob: https:",

      // Iframes (noscript GTM y recursos de Hotjar si los usa)
      "frame-src 'self' https://www.googletagmanager.com https://*.hotjar.com",
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
