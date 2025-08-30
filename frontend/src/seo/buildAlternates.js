import { REGION_HREFLANG, SITE_ORIGIN, FALLBACK_REGION } from "./localeMap.js";

export function buildAlternates(path, currentRegion) {
  const clean = path.startsWith("/") ? path : "/" + path;

  const alternates = Object.entries(REGION_HREFLANG).map(([r, hreflang]) => ({
    hreflang,
    href: `${SITE_ORIGIN}/${r}${clean}`,
  }));

  const canonical = `${SITE_ORIGIN}/${currentRegion}${clean}`;
  const xDefault = `${SITE_ORIGIN}/${FALLBACK_REGION}${clean}`;

  return { canonical, alternates, xDefault };
}
