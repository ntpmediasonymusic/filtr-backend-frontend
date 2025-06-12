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
export const logout = () => api.post("/auth/logout");
export const getFavoritePlaylists = (userId) =>
  api.get(`/users/${userId}/playlists`);
export const addFavoritePlaylist = (userId, playlistId) =>
  api.post(`/users/${userId}/playlists`, { playlistId });
export const removeFavoritePlaylist = (userId, playlistId) =>
  api.delete(`/users/${userId}/playlists/${playlistId}`);
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
