export const REGIONS = ["cr", "do", "pa"];

export function normalizeRegion(code) {
  return String(code || "").toLowerCase();
}

export function isValidRegion(code) {
  return REGIONS.includes(normalizeRegion(code));
}
