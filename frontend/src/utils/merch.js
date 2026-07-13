// Normaliza y opera sobre productos de merch.
// Aislado del JSON demo para poder sustituir la fuente por Shopify API sin tocar UI.

export function normalizeProduct(product = {}) {
  const quantity = product.inventory?.quantity ?? 0;
  const status =
    product.inventory?.status ?? (quantity > 0 ? "in_stock" : "out_of_stock");

  return {
    id: product.id,
    title: product.title ?? "",
    slug: product.slug ?? "",
    artist: product.artist?.name ?? "",
    artistSlug: product.artist?.slug ?? "",
    category: product.category ?? "",
    price: Number(product.price?.amount) || 0,
    currency: product.price?.currency ?? "USD",
    images: Array.isArray(product.images) ? product.images : [],
    quantity,
    status,
    purchaseUrl: product.purchaseUrl ?? "",
    createdAt: product.createdAt ?? product.releaseDate ?? null,
    salesCount: Number(product.salesCount) || 0,
    featuredRank: Number.isFinite(product.featuredRank)
      ? product.featuredRank
      : Number.MAX_SAFE_INTEGER,
    isFeatured: !!product.isFeatured,
  };
}

export function normalizeProducts(products = []) {
  return products.map(normalizeProduct);
}

export function getUniqueArtists(products = []) {
  const map = new Map();
  products.forEach((product) => {
    if (product.artistSlug && !map.has(product.artistSlug)) {
      map.set(product.artistSlug, {
        name: product.artist,
        slug: product.artistSlug,
      });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function filterByCategory(products = [], categoryId) {
  if (!categoryId) return products;
  return products.filter((product) => product.category === categoryId);
}

export function filterByArtist(products = [], artistSlug) {
  if (!artistSlug) return products;
  return products.filter((product) => product.artistSlug === artistSlug);
}

export function filterByAvailability(products = [], availability) {
  if (!availability) return products;
  return products.filter((product) => product.status === availability);
}

export function filterByPriceRange(products = [], min, max) {
  const parsedMin = typeof min === "number" && Number.isFinite(min) ? min : null;
  const parsedMax = typeof max === "number" && Number.isFinite(max) ? max : null;

  if (parsedMin === null && parsedMax === null) return products;

  return products.filter((product) => {
    if (parsedMin !== null && product.price < parsedMin) return false;
    if (parsedMax !== null && product.price > parsedMax) return false;
    return true;
  });
}

export function countByAvailability(products = []) {
  return products.reduce(
    (acc, product) => {
      const key = product.status === "out_of_stock" ? "out_of_stock" : "in_stock";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { in_stock: 0, out_of_stock: 0 },
  );
}

export function sortProducts(products = [], sortValue) {
  const list = [...products];
  const byDate = (product) =>
    product.createdAt ? new Date(product.createdAt).getTime() : 0;

  switch (sortValue) {
    case "title_ascending":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "title_descending":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "price_ascending":
      return list.sort((a, b) => a.price - b.price);
    case "price_descending":
      return list.sort((a, b) => b.price - a.price);
    case "date_ascending":
      return list.sort((a, b) => byDate(a) - byDate(b));
    case "date_descending":
      return list.sort((a, b) => byDate(b) - byDate(a));
    case "best_selling":
      return list.sort((a, b) => b.salesCount - a.salesCount);
    case "featured":
    case "most_relevant":
    default:
      return list.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}
