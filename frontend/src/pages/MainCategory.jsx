import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";
import { usePlaylists } from "../context/PlaylistContext";
import PageHeader from "../components/ui/PageHeader";

const MainCategoryPage = () => {
  const location = useLocation();
  const { playlists } = usePlaylists();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const categoryTitle = queryParams.get("title") || "Mood no encontrado";

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.mainCategory.includes(categoryTitle)
  );

  return (
    <>
      <div className="px-6 py-5 md:py-10">
        <PageHeader welcomeMsg={"Ana, tu vida suena así"} />
      </div>
      <div className="flex flex-col px-6 py-[50px] md:py-[50px] gap-[35px] md:gap-[50px]">
        <PlaylistsContainerGrid currentPlaylists={filteredPlaylists} />
      </div>
    </>
  );
};

export default MainCategoryPage;
