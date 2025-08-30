// filtr-frontend/src/context/PlaylistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUpdatedPlaylists } from "../api/fetchPlaylists";
import { useSortedPlaylists } from "../hooks/playlists/useSortedPlaylists";
import { useRegion } from "../router/RegionContext";

const PlaylistContext = createContext();

// eslint-disable-next-line react/prop-types
export const PlaylistProvider = ({ children }) => {
  const sortedPlaylists = useSortedPlaylists();
  const { region } = useRegion();

  const [allPlaylists, setAllPlaylists] = useState([]); // snapshot completo
  const [playlists, setPlaylists] = useState([]); // filtradas por región

  const filterByRegion = (list, r) =>
    list.filter((pl) => Array.isArray(pl.region) && pl.region.includes(r));

  const refreshPlaylists = async () => {
    const updated = await fetchUpdatedPlaylists(sortedPlaylists);
    setAllPlaylists(updated);
    setPlaylists(filterByRegion(updated, region)); // aplica filtro actual
  };

  useEffect(() => {
    refreshPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedPlaylists]);

  // cuando cambie la región, recalcula sin volver a pedir al backend
  useEffect(() => {
    setPlaylists(filterByRegion(allPlaylists, region));
  }, [region, allPlaylists]);

  return (
    <PlaylistContext.Provider value={{ playlists, refreshPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => useContext(PlaylistContext);
