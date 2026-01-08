import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const updateProfile = (userId, payload) =>
  api.put(`/users/${userId}`, payload);
export const deleteAccount = (userId) => api.delete(`/users/${userId}`);
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const logout = () => api.post("/auth/logout");
export const getFavoritePlaylists = (userId) =>
  api.get(`/users/${userId}/playlists`);
export const addFavoritePlaylist = (userId, playlistId) =>
  api.post(`/users/${userId}/playlists`, { playlistId });
export const removeFavoritePlaylist = (userId, playlistId) =>
  api.delete(`/users/${userId}/playlists/${playlistId}`);
// Seguir una playlist en la cuenta de Spotify del usuario
export const followSpotifyPlaylist = (
  userId,
  playlistId,
  {
    spotifyId,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyTokenExpiresAt,
  }
) =>
  api.post(`/users/${userId}/spotify/playlists/follow`, {
    playlistId,
    spotifyId,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyTokenExpiresAt,
  });

// Dejar de seguir una playlist en la cuenta de Spotify del usuario
export const unfollowSpotifyPlaylist = (
  userId,
  playlistId,
  {
    spotifyId,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyTokenExpiresAt,
  }
) =>
  api.post(`/users/${userId}/spotify/playlists/unfollow`, {
    playlistId,
    spotifyId,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyTokenExpiresAt,
  });
// Verificación de correo
export const confirmEmail = (token) =>
  api.get(`/auth/confirm?token=${encodeURIComponent(token)}`);
export const resendVerification = (email) =>
  api.post(`/auth/resend-verification`, { email });
// ¿Olvidaste tu contraseña?
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });
export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });

export const fetchAllPlaylists = () => api.get("/api/playlists");

// Inicio flujo "Conectar Spotify" desde el perfil
export const startSpotifyConnect = (userId, returnUrl) =>
  api.post(`/users/${userId}/spotify/connect/start`, { returnUrl });

// Desconectar Spotify del perfil
export const disconnectSpotify = (userId) =>
  api.post(`/users/${userId}/spotify/disconnect`);

// Flujo de login/signup actual con Spotify
export const spotifyLogin = () => {
  let base = import.meta.env.VITE_API_URL || window.location.origin;
  base = base.replace(/\/+$/, "");
  window.location.href = `${base}/auth/spotify/login`;
};


