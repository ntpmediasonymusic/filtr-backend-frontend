import playlistsData from "../../data/playlists.json";

export const useMoods = () => {
  const moodsMap = new Map();

  playlistsData.playlists.forEach((playlist) => {
    playlist.moods.forEach((mood) => {
      const lowerCaseMood = mood.toLowerCase();
      if (!moodsMap.has(lowerCaseMood)) {
        moodsMap.set(lowerCaseMood, mood);
      }
    });
  });

  return Array.from(moodsMap.values()).sort();
};
