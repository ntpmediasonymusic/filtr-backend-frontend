import axios from "axios";
import { getFavoritePlaylists } from "./backendApi";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data.access_token;
}

async function getPlaylistInfo(playlistUrl, token) {
  const id = playlistUrl.split("/playlist/")[1].split("?")[0];
  const res = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    playlistName: res.data.name,
    urlCoverImage: res.data.images[0]?.url || "",
  };
}

export async function fetchUpdatedPlaylists(originalPlaylists) {
  //  Traer favoritos desde tu backend
  const bearer = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  let favMap = new Map();
  if (bearer && user?.id) {
    try {
      const resp = await getFavoritePlaylists(user.id);
      // resp.data.playlists = [{ playlistId, addedAt }, ...]
      favMap = new Map(
        resp.data.playlists.map((p) => [p.playlistId, p.addedAt])
      );
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }

  // Marcar isFavorite y favoriteAddedAt
  const withFav = originalPlaylists.map((pl) => {
    const id = pl.urlPlaylist.split("/playlist/")[1].split("?")[0];
    return {
      ...pl,
      isFavorite: favMap.has(id),
      favoriteAddedAt: favMap.get(id) || null,
    };
  });

  // Actualizar datos con Spotify
  const token = await getSpotifyToken();
  if (!token) return withFav;

  const updated = await Promise.all(
    withFav.map(async (pl) => {
      const info = await getPlaylistInfo(pl.urlPlaylist, token);
      return info ? { ...pl, ...info } : pl;
    })
  );

  return updated;
}
