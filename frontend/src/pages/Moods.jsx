import { useEffect, useState } from "react";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";
import { usePlaylists } from "../context/PlaylistContext";
import moodsData from "../data/moods.json";
import MoodsHeader from "../components/moods/MoodsHeader";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";

const Moods = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { playlists } = usePlaylists();

  const [selectedMood, setSelectedMood] = useState(moodsData.moods[0]);

  const { searchQuery } = useSearch();
  
  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  // Si hay un mood seleccionado, filtrar. Si no, mostrar todas las playlists
  const filteredPlaylists = selectedMood
    ? playlists.filter(
        (playlist) =>
          Array.isArray(playlist.moods) &&
          playlist.moods.some((mood) => mood === selectedMood.name)
      )
    : playlists;

  return (
    <>
      <div className="px-6 py-5 md:py-10">
        <PageHeader welcomeMsg={"¿Cuál es tu mood de hoy?"} />
      </div>
      <div className="flex flex-col px-6 pb-[50px] md:pb-[50px] gap-[35px] md:gap-[100px]">
        <MoodsHeader
          moods={moodsData.moods}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
        />

        <PlaylistsContainerGrid currentPlaylists={filteredPlaylists} />
      </div>
    </>
  );
};

export default Moods;