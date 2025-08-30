// filtr-frontend/src/pages/Trending.jsx
import { useEffect, useMemo } from "react";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import { usePlaylists } from "../context/PlaylistContext";
import { useSearch } from "../context/SearchContext";
import TrendingPlaylistsContainerGrid from "../components/trending/TrendingPlaylistsContainerGrid";
import MusicBanner from "../components/ui/MusicBanner";
import { useRegion } from "../router/RegionContext";

const WELCOME_BY_REGION = {
  cr: "Las playlists más escuchadas en Costa Rica",
  do: "Las playlists más escuchadas en República Dominicana",
  pa: "Las playlists más escuchadas en Panamá",
};

const Trending = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { region } = useRegion();
  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();

  const welcomeMsg = WELCOME_BY_REGION[region] ?? WELCOME_BY_REGION.cr;

  const trendingPlaylists = useMemo(() => {
    const rankOf = (pl) =>
      typeof pl.trending === "number"
        ? pl.trending // compatibilidad legacy (ranking global)
        : typeof pl.trending === "object" && pl.trending !== null
        ? pl.trending[region]
        : undefined;

    return playlists
      .filter((pl) => typeof rankOf(pl) === "number") // solo las que tienen ranking para la región (o global legacy)
      .slice() // evitar mutar el array base
      .sort((a, b) => rankOf(a) - rankOf(b));
  }, [playlists, region]);

  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={welcomeMsg} />
      </div>

      <MusicBanner type="trending" />

      <div className="flex flex-col pb-[50px] md:pb-[50px] gap-[35px] md:gap-[50px]">
        <TrendingPlaylistsContainerGrid currentPlaylists={trendingPlaylists} />
      </div>
    </>
  );
};

export default Trending;
