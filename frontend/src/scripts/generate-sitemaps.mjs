import { SitemapStream } from "sitemap";
import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.somosfiltr.com";
const REGIONS = ["cr", "do", "pa"];

// Rutas estáticas (sin región). El script las prefija por región:
const STATIC_ROUTES = [
  "/",
  "/genres",
  "/moods",
  "/quizzes",
  "/shows",
  "/trending",
  "/prizes",
  "/terms-and-conditions",
  "/privacy-policy",
];

// Rutas dinámicas por JSON, cárgalas aquí y genera por región:
async function getDynamicRoutes(region) {
  // Ejemplo: shows/playlists por región (si tienes IDs o slugs)
  // const shows = JSON.parse(await readFile(`./content/${region}/shows.json`));
  // return shows.map(s => `/shows/${s.slug}`);
  return [];
}

await mkdir("./dist", { recursive: true });

// Genera 1 sitemap por región
const regionSitemaps = [];
for (const r of REGIONS) {
  const sm = new SitemapStream({ hostname: ORIGIN });

  const file = createWriteStream(path.resolve(`./dist/sitemap-${r}.xml`));
  sm.pipe(file);

  // estáticas
  for (const route of STATIC_ROUTES) {
    const url = route === "/" ? `/${r}` : `/${r}${route}`;
    sm.write({
      url,
      changefreq: "weekly",
      priority: route === "/" ? 1.0 : 0.7,
    });
  }

  // dinámicas
  const dyn = await getDynamicRoutes(r);
  for (const route of dyn) {
    sm.write({ url: `/${r}${route}`, changefreq: "daily", priority: 0.7 });
  }

  sm.end();
  await new Promise((res) => file.on("finish", res));
  regionSitemaps.push(`${ORIGIN}/sitemap-${r}.xml`);
}

// Crea sitemap index
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${regionSitemaps.map((u) => `  <sitemap><loc>${u}</loc></sitemap>`).join("\n")}
</sitemapindex>`;
await writeFile("./dist/sitemap.xml", indexXml, "utf8");

// robots.txt
const robots = `User-agent: *
Allow: /
Sitemap: ${ORIGIN}/sitemap.xml
`;
await writeFile("./dist/robots.txt", robots, "utf8");

console.log("✅ Sitemaps generados");
