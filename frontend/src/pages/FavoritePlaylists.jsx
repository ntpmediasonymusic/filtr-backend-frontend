import { useEffect } from "react";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";
import { usePlaylists } from "../context/PlaylistContext";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";

const FavoritePlaylists = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();

  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  // Filtrar sólo favoritos
  const favorites = playlists
    .filter((pl) => pl.isFavorite)
    // Ordenar por fecha de agregado más reciente primero
    .sort((a, b) => new Date(b.favoriteAddedAt) - new Date(a.favoriteAddedAt));

  return (
    <>
      <div className="px-6 py-5 md:py-10">
        <PageHeader welcomeMsg={"Mis Playlist favoritas"} />
      </div>
      <div className="flex flex-col px-6 pb-[50px] gap-[35px] md:gap-[50px]">
        <PlaylistsContainerGrid currentPlaylists={favorites} />
      </div>
    </>
  );
};

export default FavoritePlaylists;
