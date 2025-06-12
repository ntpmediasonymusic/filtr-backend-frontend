import { useEffect } from "react";
import Filter from "../components/filter/filter";
import ComingSoon from "../components/ui/ComingSoon";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import MusicBanner from "../components/ui/MusicBanner";

const Prizes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { searchQuery } = useSearch();

  // Si hay búsqueda activa, mostrar el componente Filter
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"A ganar"} />
      </div>

      <MusicBanner type="premios" />

      <div className="px-6 pb-[50px] md:pb-[50px]"><ComingSoon color="#c43ea0" /></div>
    </>
  );
};

export default Prizes;
