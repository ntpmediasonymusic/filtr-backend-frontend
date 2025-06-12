/* eslint-disable no-unused-vars */
import { fetchAllPlaylists } from "./backendApi";
import { getFavoritePlaylists } from "./backendApi";

export async function fetchUpdatedPlaylists(originalPlaylists) {
  // obtén sólo las playlists cacheadas (sin info de favoritos)
  const { data } = await fetchAllPlaylists();
  const playlistsFromBackend = data.playlists;

  // ahora mergea con favoritos (igual que antes)
  const bearer = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  let favMap = new Map();
  if (bearer && user?.id) {
    try {
      const resp = await getFavoritePlaylists(user.id);
      favMap = new Map(
        resp.data.playlists.map((p) => [p.playlistId, p.addedAt])
      );
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }

  return playlistsFromBackend.map((pl) => {
    const id = pl.urlPlaylist.split("/playlist/")[1].split("?")[0];
    return {
      ...pl,
      isFavorite: favMap.has(id),
      favoriteAddedAt: favMap.get(id) || null,
    };
  });
}
