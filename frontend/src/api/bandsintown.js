// filtr-frontend/src/api/bandsintown.js
const API_BASE = "https://rest.bandsintown.com";

/** =========================
 *  In-memory cache (vive mientras la SPA esté abierta)
 *  ========================= */
const _cache = new Map(); // key -> { ts, value }
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 min (ajústalo)

/** key helper */
function cacheKey(parts) {
  return parts.join("|");
}
function getCache(key, ttlMs = DEFAULT_TTL_MS) {
  const hit = _cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > ttlMs) {
    _cache.delete(key);
    return null;
  }
  return hit.value;
}
function setCache(key, value) {
  _cache.set(key, { ts: Date.now(), value });
  return value;
}
function clearBandsintownCache() {
  _cache.clear();
}

/** Añade app_id y UTMs a cualquier URL */
function withTracking(url, appIdOverride) {
  const app_id = appIdOverride || import.meta.env.VITE_BANDSINTOWN_APP_ID;
  const utm_source = import.meta.env.VITE_UTM_SOURCE || "somosfiltr";
  const utm_medium = import.meta.env.VITE_UTM_MEDIUM || "bit_api";
  const utm_campaign = import.meta.env.VITE_UTM_CAMPAIGN || "shows";

  const qp = new URLSearchParams();
  qp.set("app_id", app_id);
  qp.set("utm_source", utm_source);
  qp.set("utm_medium", utm_medium);
  qp.set("utm_campaign", utm_campaign);

  return url + (url.includes("?") ? "&" : "?") + qp.toString();
}

function encodeArtistName(artistName) {
  return encodeURIComponent(artistName);
}

/**
 * Listar EVENTOS por nombre de artista usando su artistApiId (app_id)
 * opts:
 *  - date: "past" | "upcoming" | "all"
 *  - ttlMs: override TTL del cache
 *  - force: true para ignorar cache
 */
async function fetchArtistEventsByName(artistName, artistApiId, opts = {}) {
  const appIdRaw = artistApiId || import.meta.env.VITE_BANDSINTOWN_APP_ID;
  const appId = encodeURIComponent(appIdRaw);
  const date = opts.date || "upcoming";
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const force = !!opts.force;

  const encoded = encodeArtistName(artistName);
  const url = `${API_BASE}/artists/${encoded}/events?app_id=${appId}&date=${date}`;

  // Cache key por artista + appId + date
  const key = cacheKey(["eventsByName", artistName, appIdRaw, date]);

  if (!force) {
    const cached = getCache(key, ttlMs);
    if (cached) return cached;
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // importante: NO uses "no-store" si quieres que el navegador ayude
    // Aun así, nuestro cache ya evita re-fetch entre navegación.
    cache: "default",
  });

  if (!res.ok) return [];
  const json = await res.json();
  if (!Array.isArray(json)) return [];

  const normalized = json.map((e) => ({
    id: e.id,
    url: withTracking(e.url, artistApiId),
    title: e.title,
    description: e.description,
    datetime: e.datetime,
    timezone: e.timezone,
    venue: e.venue || {},
    offers: Array.isArray(e.offers)
      ? e.offers.map((o) => ({
          type: o.type,
          status: o.status,
          url: withTracking(o.url, artistApiId),
        }))
      : [],
    artist_name: artistName,
    artist_id: e.artist_id,
  }));

  return setCache(key, normalized);
}

/** Utilidades de UI */
function isLivestream(ev) {
  return ev?.venue?.type === "Virtual";
}

function eventLocalDate(ev) {
  const d = new Date(ev.datetime);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** CTAs (por ahora placeholders) */
function buildFollowUrl(artistUrl, artistApiId) {
  return artistUrl ? withTracking(artistUrl, artistApiId) : "";
}
function buildNotifyUrl(eventOrArtistUrl, artistApiId) {
  return eventOrArtistUrl ? withTracking(eventOrArtistUrl, artistApiId) : "";
}
function buildRsvpUrl(eventUrl, artistApiId) {
  return eventUrl ? withTracking(eventUrl, artistApiId) : "";
}
function buildPlayMyCityUrl(artistUrl, artistApiId) {
  return artistUrl ? withTracking(artistUrl, artistApiId) : "";
}
function buildWaitlistUrl(eventUrl, artistApiId) {
  return eventUrl ? withTracking(eventUrl, artistApiId) : "";
}

export {
  withTracking,
  encodeArtistName,
  fetchArtistEventsByName,
  isLivestream,
  eventLocalDate,
  buildFollowUrl,
  buildNotifyUrl,
  buildRsvpUrl,
  buildPlayMyCityUrl,
  buildWaitlistUrl,
  clearBandsintownCache, 
};
