const axios = require("axios");
const { User, UserPlaylist } = require("../models");

// Config común para llamar a la API de Spotify (evitar proxies del entorno)
const axiosNoProxy = {
  timeout: 15000,
  proxy: false,
};

exports.list = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    // Obtiene todas las playlistIds del usuario
    const entries = await UserPlaylist.findAll({
      where: { userId },
      attributes: ["playlistId", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    // Mapea al formato deseado
    const playlists = entries.map((e) => ({
      playlistId: e.playlistId,
      addedAt: e.createdAt,
    }));
    res.json({ playlists });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { playlistId } = req.body;
    // Previene duplicados
    const exists = await UserPlaylist.findOne({
      where: { userId, playlistId },
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Playlist ya existe en favoritos" });
    }
    const entry = await UserPlaylist.create({ userId, playlistId });
    res.status(201).json({
      message: "Playlist añadida",
      id: entry.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { userId, playlistId } = req.params;
    const deleted = await UserPlaylist.destroy({
      where: { userId, playlistId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }
    res.json({ message: "Playlist eliminada" });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper: obtiene un access_token válido de Spotify para un usuario.
 * - Usa los tokens del body si vienen (desde el frontend).
 * - Si el token está expirado, intenta refrescarlo con refresh_token.
 * - Actualiza el registro del usuario en DB si se refresca el token.
 */
async function getValidSpotifyAccessToken(userId, tokensFromBody = {}) {
  const user = await User.findByPk(userId);

  if (!user) {
    const err = new Error("USER_NOT_FOUND");
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  let accessToken =
    tokensFromBody.spotifyAccessToken || user.spotifyAccessToken;
  let refreshToken =
    tokensFromBody.spotifyRefreshToken || user.spotifyRefreshToken;
  let expiresAt =
    tokensFromBody.spotifyTokenExpiresAt || user.spotifyTokenExpiresAt;

  if (!accessToken || !refreshToken || !expiresAt) {
    const err = new Error("SPOTIFY_NOT_CONNECTED");
    err.code = "SPOTIFY_NOT_CONNECTED";
    throw err;
  }

  const expDate = new Date(expiresAt);
  const now = new Date();

  // Si la fecha es inválida o el token sigue vigente, usamos el token actual
  if (Number.isNaN(expDate.getTime()) || expDate > now) {
    return { user, accessToken };
  }

  // Token expirado -> refrescar
  const tokenBody = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  }).toString();

  const tokenResp = await axios.post(
    "https://accounts.spotify.com/api/token",
    tokenBody,
    {
      ...axiosNoProxy,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, refresh_token, expires_in } = tokenResp.data;

  user.spotifyAccessToken = access_token;
  if (refresh_token) {
    // Spotify a veces devuelve un nuevo refresh_token
    user.spotifyRefreshToken = refresh_token;
  }
  user.spotifyTokenExpiresAt = new Date(Date.now() + expires_in * 1000);
  await user.save();

  return { user, accessToken: access_token };
}

/**
 * Seguir una playlist en Spotify
 * POST /users/:userId/spotify/playlists/follow
 */
exports.followSpotify = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Seguridad extra: el userId del path debe coincidir con el del token
    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({
        message:
          "No tienes permiso para seguir playlists en Spotify para este usuario",
      });
    }

    const { playlistId, ...tokensFromBody } = req.body;

    if (!playlistId) {
      return res
        .status(400)
        .json({ message: "playlistId es obligatorio para seguir en Spotify" });
    }

    const { accessToken } = await getValidSpotifyAccessToken(
      userId,
      tokensFromBody
    );

    await axios.put(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(
        playlistId
      )}/followers`,
      { public: false }, // la seguimos como no pública por defecto
      {
        ...axiosNoProxy,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ message: "Playlist seguida en Spotify" });
  } catch (err) {
    console.error(
      "Error al seguir playlist en Spotify:",
      err.response?.data || err.message
    );

    if (err.code === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (err.code === "SPOTIFY_NOT_CONNECTED") {
      return res
        .status(400)
        .json({
          message: "El usuario no tiene una cuenta de Spotify conectada",
        });
    }

    const status = err.response?.status || 500;
    return res.status(status).json({
      message: "Error al seguir playlist en Spotify",
      details: err.response?.data || err.message,
    });
  }
};

/**
 * Dejar de seguir una playlist en Spotify
 * POST /users/:userId/spotify/playlists/unfollow
 */
exports.unfollowSpotify = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({
        message:
          "No tienes permiso para dejar de seguir playlists en Spotify para este usuario",
      });
    }

    const { playlistId, ...tokensFromBody } = req.body;

    if (!playlistId) {
      return res.status(400).json({
        message: "playlistId es obligatorio para dejar de seguir en Spotify",
      });
    }

    const { accessToken } = await getValidSpotifyAccessToken(
      userId,
      tokensFromBody
    );

    await axios.delete(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(
        playlistId
      )}/followers`,
      {
        ...axiosNoProxy,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.json({ message: "Playlist dejada de seguir en Spotify" });
  } catch (err) {
    console.error(
      "Error al dejar de seguir playlist en Spotify:",
      err.response?.data || err.message
    );

    if (err.code === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (err.code === "SPOTIFY_NOT_CONNECTED") {
      return res
        .status(400)
        .json({
          message: "El usuario no tiene una cuenta de Spotify conectada",
        });
    }

    const status = err.response?.status || 500;
    return res.status(status).json({
      message: "Error al dejar de seguir playlist en Spotify",
      details: err.response?.data || err.message,
    });
  }
};
