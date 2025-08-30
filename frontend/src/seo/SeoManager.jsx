/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useRegion } from "../router/RegionContext";
import { REGIONS } from "../utils/region";
import { REGION_HREFLANG } from "./localeMap";
import { buildAlternates } from "./buildAlternates";

// Normaliza rutas tipo "/cr/moods" -> "/moods" y "/cr" -> "/"
function normalizePathname(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (REGIONS.includes(parts[0])) {
    if (parts.length === 1) return "/";
    return "/" + parts.slice(1).join("/");
  }
  return pathname;
}

// Mapa de títulos por ruta normalizada (como tenías en PageTitleProvider)
const TITLES_BY_PATH = {
  "/": "Filtr",
  "/genres": "Géneros",
  "/moods": "Moods",
  "/quizzes": "Quizzes",
  "/shows": "Shows",
  "/trending": "Trending",
  "/prizes": "Premios",
  "/login": "Acceder",
  "/signup": "Registrarse",
  "/edit-account": "Editar perfil",
  "/favorite-playlists": "Mis Playlist favoritas",
  "/verify-email": "Verificar correo",
  "/forgot-password": "Recuperar contraseña",
  "/reset-password": "Recuperar contraseña",
  "/terms-and-conditions": "Términos y Condiciones",
  "/privacy-policy": "Política de Privacidad",
};

const DESC_BY_REGION = {
  cr: "Filtr Costa Rica: playlists, shows y premios de la música en CR.",
  do: "Filtr República Dominicana: playlists, shows y premios en RD.",
  pa: "Filtr Panamá: playlists, shows y premios en Panamá.",
};

export default function SeoManager({
  overrideTitle,
  overrideDescription,
  overrideImage = "https://www.somosfiltr.com/og.jpg",
}) {
  const { region } = useRegion();
  const location = useLocation();
  const normalizedPath = normalizePathname(location.pathname);
  const base = overrideTitle ?? (TITLES_BY_PATH[normalizedPath] ?? "Filtr");
  const finalTitle = base === "Filtr" ? base : `${base} | Filtr`;
  const description = overrideDescription ?? (DESC_BY_REGION[region] ?? "Filtr: playlists, shows y premios de la música en tu país.");
  const parts = location.pathname.split("/").filter(Boolean);
  const pathNoRegion = parts.length && parts[0] in REGION_HREFLANG
    ? "/" + parts.slice(1).join("/")
    : location.pathname;

  const { canonical, alternates, xDefault } = buildAlternates(pathNoRegion, region);

  return (
    <Helmet>
      {/* Title */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Hreflang alternates */}
      {alternates.map(a => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={xDefault} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Filtr" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={overrideImage} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={REGION_HREFLANG[region] || "es"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={overrideImage} />
    </Helmet>
  );
}