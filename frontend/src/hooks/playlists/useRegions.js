import playlistsData from "../../data/playlists.json";

export const useRegions = () => {
  const regionsMap = new Map();

  playlistsData.playlists.forEach((playlist) => {
    const lowerCaseRegion = playlist.region.toLowerCase();
    if (!regionsMap.has(lowerCaseRegion)) {
      regionsMap.set(lowerCaseRegion, playlist.region);
    }
  });

  return Array.from(regionsMap.values()).sort();
};
