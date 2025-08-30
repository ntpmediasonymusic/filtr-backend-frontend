// filtr-frontend/src/pages/Shows.jsx
import { useEffect } from "react";
import { useSortedShows } from "../hooks/shows/useSortedShows";
import ShowCard from "../components/shows/ShowCard";
import ShowsHeader from "../components/shows/ShowsHeader";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";
import { useRegion } from "../router/RegionContext";

const Shows = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shows = useSortedShows();
  const { searchQuery } = useSearch();
  const { region } = useRegion();

  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }
  
  const today = new Date();

  const regionShows = shows.filter((show) => show.region === region);

  const recentShows = regionShows.filter(({ date }) => {
    // parsear "DD/MM/YYYY"
    const [day, month, year] = date.split("/").map(Number);
    const eventDate = new Date(year, month - 1, day);
    const diffMs = today.getTime() - eventDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 8;
  });

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"¡Lo que está por sonar en VIVO!"} />
      </div>

      <div className="px-6">
        <ShowsHeader />
      </div>

      <div className="grid px-6 xl:px-6 justify-items-center grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-x-[14px] xl:gap-x-[24px] gap-y-[30px] my-8 md:my-10">
        {recentShows.map((show) => (
          <ShowCard key={show.showName} {...show} />
        ))}
      </div>

      {recentShows.length <= 0 && (
        <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center pb-20 md:pb-20">
          No hay shows disponibles.
        </p>
      )}
    </>
  );
};

export default Shows;
