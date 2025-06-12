import playlistsData from "../../data/playlists.json";

export const useMainCategories = () => {
  const categoriesMap = new Map();

  playlistsData.playlists.forEach((playlist) => {
    playlist.mainCategory.forEach((category) => {
      const key = category.toLowerCase();
      if (!categoriesMap.has(key)) {
        categoriesMap.set(key, category);
      }
    });
  });
  const allCategories = Array.from(categoriesMap.values());

  // Elementos fijos al inicio
  const first = "Novedades y Éxitos";
  const second = "Recomendaciones de la semana";

  // Separar las fijas y el resto
  const dynamic = allCategories
    .filter((cat) => cat !== first && cat !== second)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return [first, second, ...dynamic];
};
