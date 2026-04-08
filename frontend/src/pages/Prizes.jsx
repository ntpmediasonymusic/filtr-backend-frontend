/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import PrizesHeader from "../components/prizes/PrizesHeader";
import LoginModal from "../components/ui/modal/LoginModal";
import { useSearch } from "../context/SearchContext";
import { useRegion } from "../router/RegionContext";
import { fetchBanners } from "../api/fetchStrapiCMS";

const Prizes = () => {
  const { searchQuery } = useSearch();
  const { region } = useRegion();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const bearer = localStorage.getItem("token");
  const loggedIn = !!bearer && !!user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancel = false;

    const normalize = (raw = []) =>
      raw.map((it) => ({
        desktop: it?.desktop || it?.mobile || "",
        mobile: it?.mobile || it?.desktop || "",
        alt: it?.alt || it?.title || "",
        link: it?.link || "", // vacío => “Próximamente”
      }));

    (async () => {
      setLoading(true);
      try {
        const data = await fetchBanners(region, "prizes_banner");
        if (!cancel) setItems(normalize(data));
      } catch (err) {
        console.error("Prizes page CMS error:", err);
        if (!cancel) setItems([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [region]);

  if (searchQuery && searchQuery.trim() !== "") return <Filter />;

  const handleClickBanner = (e) => {
    if (!loggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const list = loading ? new Array(2).fill({}) : items;

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
          {list.map((item, idx) => {
            const hasLink = !!item.link && !loading;
            const node = (
              <PrizeBannerImage
                key={idx}
                desktop={item.desktop}
                mobile={item.mobile}
                alt={item.alt}
                link={item.link}
                loading={loading}
              />
            );

            return (
              <div key={idx} className="py-6 md:py-12 first:pt-0 last:pb-0">
                {hasLink ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClickBanner}
                    className="block w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    {node}
                  </a>
                ) : (
                  <div className="block w-full overflow-hidden rounded-2xl shadow-lg">
                    {node}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {list.length <= 0 && (
          <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center pb-20 md:pb-20">
            No hay premios disponibles en este momento.
          </p>
        )}
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

function PrizeBannerImage({
  desktop = "",
  mobile = "",
  alt = "",
  link = "",
  loading = false,
}) {
  const [loaded, setLoaded] = useState(false);

  // Fallbacks de imagen
  const desktopSrc = desktop || mobile || "";
  const mobileSrc = mobile || desktop || "";
  const hasAny = Boolean(desktopSrc || mobileSrc);

  const isLinkEmpty =
    !link || String(link).trim() === "" || String(link).trim() === "#";

  const showSkeleton = loading || !hasAny || !loaded;

  const showOverlay = !loading && hasAny && loaded && isLinkEmpty;

  return (
    <div
      className="
        relative w-full overflow-hidden bg-gray-700 rounded-2xl
        before:block before:pt-[26%] md:before:pt-[20%]
      "
    >
      {showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      )}

      {hasAny && (
        <picture className="absolute inset-0 w-full h-full">
          <source media="(min-width:768px)" srcSet={desktopSrc} />
          <img
            src={mobileSrc}
            alt={alt}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              loaded && !loading ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      )}

      {showOverlay && (
        <div className="flex justify-center absolute bottom-0 left-0 w-full px-2 py-2 bg-black/80">
          <span className="leading-tight font-black text-[12px] sm:text-[12px] md:text-[20px] lg:text-[20px] xl:text-[20px] text-blue-400">
            Próximamente
          </span>
        </div>
      )}
    </div>
  );
}
