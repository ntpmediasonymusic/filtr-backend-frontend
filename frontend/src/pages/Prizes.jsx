// filtr-frontend/src/pages/Prizes.jsx
import { useEffect } from "react";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import PrizesHeader from "../components/prizes/PrizesHeader";

const imageMap = [
  {
    desktop:
      "/assets/images/prizes-banners/desktop/prizes-banner-desktop-1.png",
    mobile: "/assets/images/prizes-banners/mobile/prizes-banner-mobile-1.png",
    artist: "Fabulosos Cadillacs",
    details: "3 entradas dobles",
    link: "https://sme.wyng.com/6849b1b0de0a35f274620a26",
  },
  {
    desktop:
      "/assets/images/prizes-banners/desktop/prizes-banner-desktop-2.png",
    mobile: "/assets/images/prizes-banners/mobile/prizes-banner-mobile-2.png",
    artist: "Rauw Alejandro",
    details: "Sorteo Vinilos",
    link: "https://sme.wyng.com/67ff0562241ac13160fa4800",
  },
];

const Prizes = () => {
  const { searchQuery } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Si hay búsqueda activa, mostramos el filtro
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg="A ganar" />
      </div>

      <div className="px-6">
        <PrizesHeader />
      </div>
      <div className="flex flex-col px-8 md:px-12 my-[40px] md:my-[80px]">
        <div className="divide-y-3 divide-gray-200">
          {imageMap.map((item, idx) => {
            const content = (
              <picture>
                <source media="(min-width: 768px)" srcSet={item.desktop} />
                <img
                  src={item.mobile}
                  alt={`${item.artist} - ${item.details}`}
                  className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                />
              </picture>
            );

            return (
              <div key={idx} className="py-6 md:py-12 first:pt-0 last:pb-0">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="block w-full overflow-hidden rounded-2xl shadow-lg">
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Prizes;
