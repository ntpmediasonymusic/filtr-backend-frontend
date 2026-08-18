// Fuente unica de verdad para el slug de artista usado en la URL de Shows.

// Rango Unicode de marcas diacriticas combinantes (0x0300-0x036F), construido
// por codigo para evitar literales de ancho variable en el archivo fuente.
const COMBINING_MARKS_RE = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g",
);

export function slugifyArtistName(name = "") {
  return String(name)
    .normalize("NFD")
    .replace(COMBINING_MARKS_RE, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Permite que un artista traiga su propio slug explicito en el futuro
// (ej. si bitArtists.json llegara a necesitarlo por colision), sin romper
// a los que no lo tienen.
export function getArtistSlug(artist) {
  return artist?.slug || slugifyArtistName(artist?.name);
}

export function findArtistBySlug(artistList = [], slug = "") {
  if (!slug) return null;
  const target = slugifyArtistName(slug);
  if (!target) return null;
  return artistList.find((a) => getArtistSlug(a) === target) || null;
}
