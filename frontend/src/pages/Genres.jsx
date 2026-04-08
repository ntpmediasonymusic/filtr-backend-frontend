import { useEffect, useState } from "react";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";
import { usePlaylists } from "../context/PlaylistContext";
import GenresHeader from "../components/genres/GenresHeader";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";
import MusicBanner from "../components/ui/MusicBanner";
import { fetchGenres } from "../api/fetchStrapiCMS";

const Genres = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchGenres();
        if (cancelled) return;
        const normalized = data.map((g) => ({
          name: g.name,
          desktopImage: g.desktop,
          mobileImage: g.mobile,
        }));
        setGenres(normalized);
        setSelectedGenre(normalized[0] || null);
      } catch (e) {
        console.error("fetchGenres error:", e);
        if (!cancelled) {
          setGenres([]);
          setSelectedGenre(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  // Filtrado por género seleccionado
  const filteredPlaylists = selectedGenre
    ? playlists.filter(
        (playlist) =>
          playlist.genre && playlist.genre.includes(selectedGenre.name),
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
          loading={loading}
          genres={genres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
        />
        <PlaylistsContainerGrid currentPlaylists={filteredPlaylists} />
      </div>
    </>
  );
};

export default Genres;
