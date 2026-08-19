// Genera variantes optimizadas de las fotos de Galeria y reescribe
// show-gallery.json para que apunten a ellas. Los archivos originales NUNCA
// se tocan ni se renombran: las variantes se escriben en una subcarpeta
// "optimized/" al lado de cada original, y se pueden regenerar en cualquier
// momento volviendo a correr este script.
//
// Uso: npm run optimize:gallery

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../..");
const DATA_PATH = path.join(ROOT, "src/data/show-gallery.json");
const PUBLIC_DIR = path.join(ROOT, "public");

// Ancho maximo (lado largo) de cada variante. No se agranda una imagen que
// ya sea mas chica (withoutEnlargement).
const THUMB_WIDTH = 480; // grid de miniaturas
const DISPLAY_WIDTH = 2000; // lightbox y descarga
const OG_WIDTH = 1200; // meta og:image / twitter:image (JPEG, compatibilidad social)

const THUMB_QUALITY = 72;
const DISPLAY_QUALITY = 82;
const OG_QUALITY = 82;

function publicPathToDisk(publicPath) {
  return path.join(PUBLIC_DIR, publicPath.replace(/^\/+/, ""));
}

function diskPathToPublic(diskPath) {
  return "/" + path.relative(PUBLIC_DIR, diskPath).split(path.sep).join("/");
}

function variantPaths(originalPublicPath) {
  const diskOriginal = publicPathToDisk(originalPublicPath);
  const dir = path.dirname(diskOriginal);
  const base = path.basename(diskOriginal, path.extname(diskOriginal));
  const outDir = path.join(dir, "optimized");
  return {
    outDir,
    thumb: path.join(outDir, `${base}-thumb.webp`),
    display: path.join(outDir, `${base}-display.webp`),
    og: path.join(outDir, `${base}-og.jpg`),
    original: diskOriginal,
  };
}

async function ensureVariant(sourceDisk, outPath, build) {
  await mkdir(path.dirname(outPath), { recursive: true });
  const image = sharp(sourceDisk).rotate(); // respeta orientacion EXIF
  const info = await build(image).toFile(outPath);
  return { width: info.width, height: info.height };
}

async function processOne(originalPublicPath, { needsOg }) {
  const { outDir, thumb, display, og, original } = variantPaths(originalPublicPath);
  await mkdir(outDir, { recursive: true });

  const thumbMeta = await ensureVariant(original, thumb, (img) =>
    img
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY }),
  );

  const displayMeta = await ensureVariant(original, display, (img) =>
    img
      .resize({ width: DISPLAY_WIDTH, withoutEnlargement: true })
      .webp({ quality: DISPLAY_QUALITY }),
  );

  let ogPublicPath = null;
  if (needsOg) {
    await ensureVariant(original, og, (img) =>
      img
        .resize({ width: OG_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: OG_QUALITY, mozjpeg: true }),
    );
    ogPublicPath = diskPathToPublic(og);
  }

  return {
    thumbnail: diskPathToPublic(thumb),
    source: diskPathToPublic(display),
    displayWidth: displayMeta.width,
    displayHeight: displayMeta.height,
    ogImage: ogPublicPath,
    thumbWidth: thumbMeta.width,
    thumbHeight: thumbMeta.height,
  };
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const events = JSON.parse(raw);

  // Cache: un mismo archivo original (p.ej. la portada tambien vive en la
  // galeria) solo se procesa una vez.
  const cache = new Map();

  let processed = 0;

  for (const event of events) {
    const coverOriginal = event.cover.source;

    for (const item of event.gallery) {
      const needsOg = item.source === coverOriginal;
      let result = cache.get(item.source);
      if (!result) {
        result = await processOne(item.source, { needsOg });
        cache.set(item.source, result);
        processed++;
        process.stdout.write(`\r  optimizando ${processed} imagenes...`);
      }

      item.thumbnail = result.thumbnail;
      item.source = result.source;
      item.width = result.displayWidth;
      item.height = result.displayHeight;

      if (needsOg && result.ogImage) {
        event.cover.source = result.source;
        event.cover.width = result.displayWidth;
        event.cover.height = result.displayHeight;
        event.seo.image = result.ogImage;
      }
    }
  }

  process.stdout.write("\n");
  await writeFile(DATA_PATH, JSON.stringify(events, null, 2) + "\n", "utf8");
  console.log(`Listo: ${processed} imagenes optimizadas, show-gallery.json actualizado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
