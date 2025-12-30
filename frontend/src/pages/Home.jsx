import { useEffect } from "react";
import HeaderCarousel from "../components/home/HeaderCarousel";
import MainCategoryPreview from "../components/home/MainCategoryPreview";
import PageHeader from "../components/ui/PageHeader";
import { usePlaylists } from "../context/PlaylistContext";
import { useSearch } from "../context/SearchContext";
import { useMainCategories } from "../hooks/playlists/useMainCategories";
import Filter from "../components/filter/filter";
import { useRegion } from "../router/RegionContext";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mainCategories = useMainCategories();
  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();
  const { region } = useRegion();

  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  // Vista normal sin búsqueda
  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"Tu vida suena así"} />
      </div>

      <div>
        <HeaderCarousel />
      </div>

      <div className="flex flex-col gap-[50px] md:gap-[50px] px-4 md:px-6 py-[50px] md:py-[50px]">
        {/* 🔄 Iterar sobre todas las categorías y generar un MainCategoryPreview */}
        {mainCategories.map((category) => {
          // Filtrar las playlists que pertenezcan a la categoría actual
          const filteredPlaylistsFilter = playlists
            .filter((playlist) => playlist.mainCategory.includes(category))
            .filter(
              (playlist) =>
                !(
                  Array.isArray(playlist.excludeRegion) &&
                  playlist.excludeRegion.includes(region)
                )
            );

          // Renderizar solo si hay playlists en esta categoría
          return filteredPlaylistsFilter.length > 0 ? (
            <MainCategoryPreview
              key={category} // Clave única para cada iteración
              title={category}
              playlists={filteredPlaylistsFilter}
            />
          ) : null;
        })}
      </div>
    </>
  );
};

export default Home;