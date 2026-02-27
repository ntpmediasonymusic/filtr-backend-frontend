export const REGIONS = ["cr", "do", "pa", "gt", "sv", "us"];

export function normalizeRegion(code) {
  return String(code || "").toLowerCase();
}

export function isValidRegion(code) {
  return REGIONS.includes(normalizeRegion(code));
}
