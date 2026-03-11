// filtr-frontend/src/api/bandsintown.js
const API_BASE = "https://rest.bandsintown.com";

/** =========================
 *  In-memory cache (vive mientras la SPA esté abierta)
 *  ========================= */
const _cache = new Map(); // key -> { ts, value }
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 min

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
 * ARTIST INFO por nombre (para image_url / thumb_url)
 * opts:
 *  - ttlMs: override TTL del cache
 *  - force: true para ignorar cache
 */
async function fetchArtistInfoByName(artistName, artistApiId, opts = {}) {
  const appIdRaw = artistApiId || import.meta.env.VITE_BANDSINTOWN_APP_ID;
  const appId = encodeURIComponent(appIdRaw);
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const force = !!opts.force;

  const encoded = encodeArtistName(artistName);
  const url = `${API_BASE}/artists/${encoded}?app_id=${appId}`;

  const key = cacheKey(["artistInfoByName", artistName, appIdRaw]);

  if (!force) {
    const cached = getCache(key, ttlMs);
    if (cached) return cached;
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "default",
  });

  if (!res.ok) return null;

  const json = await res.json();
  if (!json || typeof json !== "object") return null;

  const normalized = {
    id: json.id ?? null,
    name: json.name ?? artistName,
    url: json.url ? withTracking(json.url, artistApiId) : "",
    image_url: json.image_url || "",
    thumb_url: json.thumb_url || "",
    facebook_page_url: json.facebook_page_url || "",
    tracker_count: json.tracker_count ?? null,
  };

  return setCache(key, normalized);
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

  const key = cacheKey(["eventsByName", artistName, appIdRaw, date]);

  if (!force) {
    const cached = getCache(key, ttlMs);
    if (cached) return cached;
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
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

function addTrigger(url, trigger) {
  if (!url || !trigger) return url || "";
  try {
    const u = new URL(url);
    u.searchParams.set("trigger", trigger);
    return u.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}trigger=${encodeURIComponent(trigger)}`;
  }
}

/** CTAs (siguen abriendo Bandsintown; triggers ayudan a “caer” a la acción) */
function buildFollowUrl(artistUrl, artistApiId) {
  const base = artistUrl ? withTracking(artistUrl, artistApiId) : "";
  return addTrigger(base, "track");
}
function buildRsvpUrl(eventUrl, artistApiId) {
  const base = eventUrl ? withTracking(eventUrl, artistApiId) : "";
  return addTrigger(base, "rsvp_going");
}
function buildNotifyUrl(eventUrl, artistApiId) {
  const base = eventUrl ? withTracking(eventUrl, artistApiId) : "";
  return addTrigger(base, "notify_me");
}
function buildWaitlistUrl(eventUrl, artistApiId) {
  return eventUrl ? withTracking(eventUrl, artistApiId) : "";
}
function buildPlayMyCityUrl(artistUrl, artistApiId) {
  return artistUrl ? withTracking(artistUrl, artistApiId) : "";
}

export {
  withTracking,
  encodeArtistName,
  fetchArtistInfoByName,
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
