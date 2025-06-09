import playlistsData from "../../data/playlists.json";

export const useMainCategories = () => {
  const categoriesMap = new Map();

  playlistsData.playlists.forEach((playlist) => {
    playlist.mainCategory.forEach((category) => {
      const lowerCaseCategory = category.toLowerCase();
      if (!categoriesMap.has(lowerCaseCategory)) {
        categoriesMap.set(lowerCaseCategory, category); 
      }
    });
  });

  return Array.from(categoriesMap.values()).sort();
};
