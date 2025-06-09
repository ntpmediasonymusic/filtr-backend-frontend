// filtr-frontend/src/pages/Trending.jsx
import { useEffect, useMemo } from "react";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import { usePlaylists } from "../context/PlaylistContext";
import { useSearch } from "../context/SearchContext";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";

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
      <div className="px-6 py-5 md:py-10">
        <PageHeader welcomeMsg={"Las playlist más escuchadas"} />
      </div>
      <div className="flex flex-col pb-[50px] md:pb-[50px] gap-[35px] md:gap-[50px]">
        <PlaylistsContainerGrid currentPlaylists={trendingPlaylists} />
      </div>
    </>
  );
};

export default Trending;
