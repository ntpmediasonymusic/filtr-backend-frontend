import { useEffect } from "react";
import { useSortedShows } from "../hooks/shows/useSortedShows";
import ShowCard from "../components/shows/ShowCard";
import ShowsHeader from "../components/shows/ShowsHeader"; 
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";

const Shows = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const shows = useSortedShows();

  const { searchQuery } = useSearch();

  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"¡Lo que está por sonar en VIVO!"} />
      </div>

      <div className="px-6">
        <ShowsHeader />
      </div>
      <div className="grid px-6 xl:px-0 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-[14px] xl:gap-x-[24px] gap-y-[30px] my-8 md:my-10">
        {shows.map((show) => (
          <ShowCard key={show.showName} {...show} />
        ))}
      </div>
    </>
  );
};

export default Shows;
