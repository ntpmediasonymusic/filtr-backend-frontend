/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import PrizesHeader from "../components/prizes/PrizesHeader";
import LoginModal from "../components/ui/modal/LoginModal";

const imageMap = [
  {
    desktop:
      "/assets/images/prizes-banners/desktop/prizes-banner-desktop-4.png",
    mobile: "/assets/images/prizes-banners/mobile/prizes-banner-mobile-4.png",
    artist: "Debi Nova",
    details: "Entrada Doble",
    link: "https://forms.sonymusicfans.com/campaign/debinova-todopuedeconvertirseencancion-evento-2025/",
  },
  {
    desktop:
      "/assets/images/prizes-banners/desktop/prizes-banner-desktop-3.png",
    mobile: "/assets/images/prizes-banners/mobile/prizes-banner-mobile-3.png",
    artist: "Manuel Turizo",
    details: "Entrada doble Meet & Greet",
    link: "https://sme.wyng.com/6879a194e24c23e06d2ba445",
  },
];

const Prizes = () => {
  const { searchQuery } = useSearch();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Datos del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const bearer = localStorage.getItem("token");
  const loggedIn = !!bearer && !!user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Si hay búsqueda activa, mostramos el filtro
  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  const handleClickBanner = (e) => {
    if (!loggedIn) {
      // si no está logueado: cancelar apertura y mostrar modal
      e.preventDefault();
      setShowLoginModal(true);
    }
    // si está logueado, no hacemos nada, el <a> abre en nueva pestaña por defecto
  };

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg="¡A ganar!" />
      </div>

      <div className="px-6">
        <PrizesHeader />
      </div>
      <div className="flex flex-col px-8 md:px-12 my-[40px] md:my-[80px]">
        <div className="divide-y-3 divide-gray-200">
          {imageMap.map((item, idx) => (
            <div key={idx} className="py-6 md:py-12 first:pt-0 last:pb-0">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClickBanner}
                  className="block w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <PrizeBannerImage
                    desktop={item.desktop}
                    mobile={item.mobile}
                    alt={`${item.artist} - ${item.details}`}
                  />
                </a>
              ) : (
                <div className="block w-full overflow-hidden rounded-2xl shadow-lg">
                  <PrizeBannerImage
                    desktop={item.desktop}
                    mobile={item.mobile}
                    alt={`${item.artist} - ${item.details}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Modal de Login */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            message={
              "Para acceder a los premios primero debes de iniciar sesión"
            }
          />
        )}
      </div>
    </>
  );
};

export default Prizes;

// Helper component for skeleton + responsive aspect ratio
function PrizeBannerImage({ desktop, mobile, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="
        relative w-full overflow-hidden bg-gray-700 rounded-2xl
        before:block before:pt-[26%] md:before:pt-[20%]
      "
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      )}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width:768px)" srcSet={desktop} />
        <img
          src={mobile}
          alt={alt}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-500
            ${loaded ? "opacity-100" : "opacity-0"}
          `}
        />
      </picture>
    </div>
  );
}
