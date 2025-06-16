import { useEffect, useState, useMemo } from "react";
import PageHeader from "../ui/PageHeader";
import { usePlaylists } from "../../context/PlaylistContext";
import { useSearch } from "../../context/SearchContext";
import genresData from "../../data/genres.json";
import GenresHeader from "../genres/GenresHeader";
import PlaylistsContainerGrid from "../ui/PlaylistsContainerGrid";
import moodsData from "../../data/moods.json";
import MoodsHeader from "../moods/MoodsHeader";

const Filter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();

  // Inicializar sin ningún filtro seleccionado
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  // Filtrar géneros según la búsqueda
  const filteredGenres = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return genresData.genres;

    const query = searchQuery.toLowerCase().trim();
    return genresData.genres.filter((genre) =>
      genre.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Filtrar moods según la búsqueda
  const filteredMoods = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return moodsData.moods;

    const query = searchQuery.toLowerCase().trim();
    return moodsData.moods.filter((mood) =>
      mood.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Primero filtrar por búsqueda si existe
  const searchFilteredPlaylists = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return playlists;

    const query = searchQuery.toLowerCase().trim();

    return playlists.filter((playlist) => {
      // Buscar en el nombre de la playlist
      if (playlist.playlistName?.toLowerCase().includes(query)) return true;

      // Buscar en las categorías principales (array)
      if (
        playlist.mainCategory?.some((cat) => cat.toLowerCase().includes(query))
      )
        return true;

      // Buscar en los géneros (array)
      if (playlist.genre?.some((gen) => gen.toLowerCase().includes(query)))
        return true;

      // Buscar en los moods (array)
      if (playlist.moods?.some((mood) => mood.toLowerCase().includes(query)))
        return true;

      // Buscar en la región
      if (playlist.region?.toLowerCase().includes(query)) return true;

      return false;
    });
  }, [searchQuery, playlists]);

  // Luego aplicar filtros de género y mood
  const filteredPlaylists = useMemo(() => {
    let filtered = searchFilteredPlaylists;

    // Solo filtrar por género si hay uno seleccionado
    if (selectedGenre) {
      filtered = filtered.filter(
        (playlist) =>
          playlist.genre && playlist.genre.includes(selectedGenre.name)
      );
    }

    // Solo filtrar por mood si hay uno seleccionado
    if (selectedMood) {
      filtered = filtered.filter(
        (playlist) =>
          playlist.moods && playlist.moods.includes(selectedMood.name)
      );
    }

    return filtered;
  }, [searchFilteredPlaylists, selectedGenre, selectedMood]);

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader
          welcomeMsg={
            searchQuery ? `Resultados para "${searchQuery}"` : "Filtro"
          }
        />
      </div>

      <div className="px-4 md:px-10">
        <GenresHeader
          genres={filteredGenres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          filter={true}
        />
      </div>

      <div className="px-4 md:px-10">
        <MoodsHeader
          moods={filteredMoods}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          filter={true}
        />
      </div>

      {filteredPlaylists.length === 0 ? (
        <div className="px-8 py-20 text-center">
          <p className="text-gray-400 text-lg">
            No se encontraron playlists con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="gap-[50px] md:gap-[50px] md:px-8 py-[50px] md:py-[50px]">
          <PlaylistsContainerGrid currentPlaylists={filteredPlaylists} />
        </div>
      )}
    </>
  );
};

export default Filter;
