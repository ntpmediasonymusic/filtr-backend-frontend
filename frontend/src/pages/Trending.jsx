// filtr-frontend/src/pages/Trending.jsx
import { useEffect, useMemo } from "react";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import { usePlaylists } from "../context/PlaylistContext";
import { useSearch } from "../context/SearchContext";
import TrendingPlaylistsContainerGrid from "../components/trending/TrendingPlaylistsContainerGrid";
import MusicBanner from "../components/ui/MusicBanner";

const Trending = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();

  const trendingPlaylists = useMemo(() => {
    return playlists
      .filter((pl) => typeof pl.trending === "number")
      .sort((a, b) => a.trending - b.trending);
  }, [playlists]);

  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"Las playlist más escuchadas"} />
      </div>

      <MusicBanner type="trending" />

      <div className="flex flex-col pb-[50px] md:pb-[50px] gap-[35px] md:gap-[50px]">
        <TrendingPlaylistsContainerGrid currentPlaylists={trendingPlaylists} />
      </div>
    </>
  );
};

export default Trending;
