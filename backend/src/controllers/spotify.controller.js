const fs = require("fs");
const path = require("path");
const axios = require("axios");

let cache = {
  timestamp: 0,
  data: null,
};

async function fetchSpotifyToken() {
  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data.access_token;
}

async function getPlaylistInfo(id, token) {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/playlists/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return {
    playlistName: data.name,
    urlCoverImage: data.images[0]?.url || "",
  };
}

/**
 * GET /api/playlists
 * — cargar playlists.json
 * — si no hay cache o expiró, refrescar:
 *     * obtener token
 *     * para cada playlist en el JSON: extraer ID, llamar a Spotify, retry en 429
 *     * almacenar en cache
 * — devolver cache.data
 */
exports.getUpdatedPlaylists = async (req, res, next) => {
  try {
    const now = Date.now();
    const shouldRefresh =
      !cache.data || now - cache.timestamp > 24 * 60 * 60 * 1000;

    if (shouldRefresh) {
      const filePath = path.join(__dirname, "../data/playlists.json");
      const raw = fs.readFileSync(filePath, "utf-8");
      const { playlists } = JSON.parse(raw);

      const token = await fetchSpotifyToken();

      const enriched = await Promise.all(
        playlists.map(async (pl) => {
          const id = pl.urlPlaylist.split("/playlist/")[1].split("?")[0];
          let info;
          try {
            info = await getPlaylistInfo(id, token);
          } catch (err) {
            if (err.response?.status === 429) {
              // simple back-off + retry una vez
              await new Promise((r) => setTimeout(r, 1000));
              info = await getPlaylistInfo(id, token);
            } else {
              throw err;
            }
          }
          return { ...pl, ...info };
        })
      );

      cache = { timestamp: now, data: enriched };
    }

    return res.json({ playlists: cache.data });
  } catch (err) {
    next(err);
  }
};
