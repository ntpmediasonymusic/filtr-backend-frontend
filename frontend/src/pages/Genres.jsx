import { useEffect, useState } from "react";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";
import { usePlaylists } from "../context/PlaylistContext";
import GenresHeader from "../components/genres/GenresHeader";
import genresData from "../data/genres.json";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";
import MusicBanner from "../components/ui/MusicBanner";

const Genres = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { playlists } = usePlaylists();

  // Inicializar con el primer género seleccionado
  const [selectedGenre, setSelectedGenre] = useState(genresData.genres[0]);
  const { searchQuery } = useSearch();

  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  // Si hay un género seleccionado, filtrar. Si no, mostrar todas las playlists
  const filteredPlaylists = selectedGenre
    ? playlists.filter(
        (playlist) =>
          playlist.genre && playlist.genre.includes(selectedGenre.name)
      )
    : playlists;

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"¿Qué género quieres escuchar hoy?"} />
      </div>

      <MusicBanner type="generos" />

      <div className="flex flex-col px-6 pb-[50px] md:pb-[50px] gap-[35px] md:gap-[80px]">
        <GenresHeader
          genres={genresData.genres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
        />

        <PlaylistsContainerGrid currentPlaylists={filteredPlaylists} />
      </div>
    </>
  );
};

export default Genres;
