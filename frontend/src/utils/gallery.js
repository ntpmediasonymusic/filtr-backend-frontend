// Servicio local de datos para la seccion Galeria (recaps de eventos).
// Fase 1: la fuente es data/show-gallery.json. El dia que exista Strapi,
// solo este archivo debe cambiar (fetch en vez de import) sin tocar componentes.

import rawEvents from "../data/show-gallery.json";
import { SITE_ORIGIN } from "../seo/localeMap.js";

// TODO: reactivar el requisito de sesión iniciada para ver galerías.
// Puesto en `false` a pedido explícito (temporal); volver a `true` restaura
// el gate de autenticación en Gallery.jsx y GalleryEvent.jsx sin tocar nada más.
export const GALLERY_REQUIRE_AUTH = false;

/**
 * @typedef {Object} MediaAsset
 * @property {string} source
 * @property {string} alt
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} SeoMetadata
 * @property {string} title
 * @property {string} description
 * @property {string} image
 */

/**
 * @typedef {Object} GalleryItem
 * @property {string} id
 * @property {"image"|"video"} type
 * @property {string} thumbnail
 * @property {string} source
 * @property {string} [title]
 * @property {string} [caption]
 * @property {string} alt
 * @property {string} [credit]
 * @property {boolean} downloadable
 * @property {boolean} shareable
 * @property {boolean} restricted
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [duration] segundos, solo para videos
 */

/**
 * @typedef {Object} RecapEvent
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} artist
 * @property {string} eventType
 * @property {string} date fecha ISO (YYYY-MM-DD)
 * @property {string} city
 * @property {string} country
 * @property {string} description
 * @property {MediaAsset} cover
 * @property {"new"|"featured"|"exclusive"|"upcoming"} [status]
 * @property {GalleryItem[]} gallery
 * @property {SeoMetadata} seo
 */

/** @type {RecapEvent[]} */
const RAW_EVENTS = Array.isArray(rawEvents) ? rawEvents : [];

// Marcas diacriticas combinantes (0x0300-0x036F), construidas por codigo
// para evitar literales de ancho variable en el archivo fuente.
const COMBINING_MARKS_RE = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g",
);

function normalizeSearchText(s = "") {
  return String(s)
    .normalize("NFD")
    .replace(COMBINING_MARKS_RE, "")
    .toLowerCase()
    .trim();
}

function parseIsoDate(dateStr) {
  if (!dateStr) return null;
  const d = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? new Date(`${dateStr}T00:00:00`)
    : new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function yearOf(dateStr) {
  const d = parseIsoDate(dateStr);
  return d ? d.getFullYear() : null;
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

/** Todos los eventos, del mas reciente al mas antiguo por `date`. */
export function getAllEvents() {
  return [...RAW_EVENTS].sort((a, b) => {
    const db = parseIsoDate(b.date)?.getTime() ?? 0;
    const da = parseIsoDate(a.date)?.getTime() ?? 0;
    return db - da;
  });
}

/** @returns {RecapEvent|null} */
export function findEventBySlug(slug) {
  if (!slug) return null;
  return RAW_EVENTS.find((e) => e.slug === slug) || null;
}

/** Valores unicos disponibles para los filtros del catalogo. */
export function getGalleryFilterOptions(events = RAW_EVENTS) {
  return {
    eventTypes: uniqueSorted(events.map((e) => e.eventType)),
    countries: uniqueSorted(events.map((e) => e.country)),
    artists: uniqueSorted(events.map((e) => e.artist)),
    years: Array.from(new Set(events.map((e) => yearOf(e.date)).filter(Boolean))).sort(
      (a, b) => b - a,
    ),
  };
}

/**
 * Aplica busqueda + filtros combinados sobre la coleccion completa.
 * @param {RecapEvent[]} events
 * @param {{search?:string, eventType?:string, country?:string, artist?:string, year?:string|number}} filters
 */
export function filterGalleryEvents(events, filters = {}) {
  const {
    search = "",
    eventType = "all",
    country = "all",
    artist = "all",
    year = "all",
  } = filters;

  const query = normalizeSearchText(search);

  return events.filter((event) => {
    if (eventType !== "all" && event.eventType !== eventType) return false;
    if (country !== "all" && event.country !== country) return false;
    if (artist !== "all" && event.artist !== artist) return false;
    if (year !== "all" && String(yearOf(event.date)) !== String(year))
      return false;

    if (query) {
      const haystack = normalizeSearchText(`${event.title} ${event.artist}`);
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

/** Filtra los elementos de una galeria por tipo de medio. */
export function filterMediaByType(gallery = [], mode = "all") {
  if (mode === "all") return gallery;
  return gallery.filter((item) => item.type === mode);
}

/** Formatea una fecha ISO con Intl.DateTimeFormat. style: "long" | "short". */
export function formatEventDate(dateStr, { style = "long" } = {}) {
  const d = parseIsoDate(dateStr);
  if (!d) return "";

  if (style === "short") {
    const formatted = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
    return formatted.replace(".", "").toUpperCase();
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Formatea segundos como mm:ss para la duracion de un video. */
export function formatMediaDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** URL publica y compartible de un evento (sin query params). */
export function buildEventUrl({ region, slug, origin = SITE_ORIGIN }) {
  return `${origin}/${region}/galeria/${encodeURIComponent(slug)}`;
}

/** URL publica y compartible de una pieza especifica dentro de un evento. */
export function buildMediaShareUrl({ region, slug, mediaId, origin = SITE_ORIGIN }) {
  return `${buildEventUrl({ region, slug, origin })}?media=${encodeURIComponent(mediaId)}`;
}

/** Convierte una ruta relativa (/assets/...) en una URL absoluta para SEO/OG. */
export function toAbsoluteUrl(pathOrUrl, origin = SITE_ORIGIN) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
