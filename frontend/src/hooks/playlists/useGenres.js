import playlistsData from "../../data/playlists.json";

export const useGenres = () => {
  const genresMap = new Map();

  playlistsData.playlists.forEach((playlist) => {
    playlist.genre.forEach((g) => {
      const lowerCaseGenre = g.toLowerCase();
      if (!genresMap.has(lowerCaseGenre)) {
        genresMap.set(lowerCaseGenre, g);
      }
    });
  });

  return Array.from(genresMap.values()).sort();
};
