// backend/src/utils/smf.js
// ✅ Backend-only utilities (NO React / NO JSX)

// Regiones soportadas en el sitio
const REGIONS = ["cr", "do", "pa", "gt", "sv", "us"];

/**
 * Normaliza código de región a minúsculas.
 */
function normalizeRegion(code) {
  return String(code || "").toLowerCase();
}

/**
 * Valida si la región existe en el sitio.
 */
function isValidRegion(code) {
  return REGIONS.includes(normalizeRegion(code));
}

/**
 * Garantiza una región válida, devolviendo fallback si no lo es.
 */
function coerceRegion(code, fallback = "cr") {
  const r = normalizeRegion(code);
  return isValidRegion(r) ? r : fallback;
}

module.exports = {
  REGIONS,
  normalizeRegion,
  isValidRegion,
  coerceRegion,
};
