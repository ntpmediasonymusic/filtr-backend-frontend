import { createContext, useContext, useEffect, useState } from "react";
import { fetchUpdatedPlaylists } from "../api/fetchPlaylists";
import { useSortedPlaylists } from "../hooks/playlists/useSortedPlaylists";

const PlaylistContext = createContext();
// eslint-disable-next-line react/prop-types
export const PlaylistProvider = ({ children }) => {
  const sortedPlaylists = useSortedPlaylists();
  const [playlists, setPlaylists] = useState([]);

  const refreshPlaylists = async () => {
    const updated = await fetchUpdatedPlaylists(sortedPlaylists);
    setPlaylists(updated);
  };

  useEffect(() => {
    refreshPlaylists();
  }, [sortedPlaylists]);

  return (
    <PlaylistContext.Provider value={{ playlists, refreshPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => useContext(PlaylistContext);
