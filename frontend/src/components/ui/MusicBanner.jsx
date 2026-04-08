/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useRegion } from "../../router/RegionContext";
import { fetchBanners } from "../../api/fetchStrapiCMS";

const PLACEMENTS = {
  generos: "genres_header",
  moods: "moods_header",
  trending: "trending_header",
};

const MusicBanner = ({ type = "generos" }) => {
  const { region } = useRegion();
  const placement = PLACEMENTS[type] || PLACEMENTS.generos;

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    (async () => {
      setLoading(true);
      try {
        const items = await fetchBanners(region, placement);
        if (!cancel) setBanner(items?.[0] || null);
      } catch (err) {
        console.error("MusicBanner CMS error:", err);
        if (!cancel) setBanner(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [region, placement]);

  // Si no hay banner, no renderizamos nada
  if (!loading && !banner) return null;

  // Normalización aquí también por si quieres decidir antes de renderizar
  const normalized = banner
    ? {
        desktop: banner.desktop || banner.mobile || "",
        mobile: banner.mobile || banner.desktop || "",
        alt: banner.alt || `Banner ${type}`,
        link: banner.link,
      }
    : null;

  const hasAny = Boolean(normalized?.desktop || normalized?.mobile);

  return (
    <div className="px-6 pb-5 md:pb-10">
      {normalized?.link && normalized.link !== "#" && hasAny ? (
        <a href={normalized.link} target="_blank" rel="noopener noreferrer">
          <MusicBannerImage
            desktop={normalized.desktop}
            mobile={normalized.mobile}
            alt={normalized.alt}
            loading={loading}
          />
        </a>
      ) : (
        <MusicBannerImage
          desktop={normalized?.desktop}
          mobile={normalized?.mobile}
          alt={normalized?.alt || `Banner ${type}`}
          loading={loading}
        />
      )}
    </div>
  );
};

function MusicBannerImage({ desktop = "", mobile = "", alt = "", loading }) {
  const [loaded, setLoaded] = useState(false);

  // Reglas de respaldo: si falta una, usa la otra; si faltan ambas, placeholder.
  const desktopSrc = desktop || mobile || "";
  const mobileSrc = mobile || desktop || "";
  const hasAny = Boolean(desktopSrc || mobileSrc);

  // Si no hay ninguna imagen, solo placeholder vacío
  if (!hasAny) {
    return (
      <div
        className="
          relative w-full overflow-hidden bg-gray-700 rounded-[10px]
          before:block before:pt-[26.5%] md:before:pt-[20%]
        "
      >
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      </div>
    );
  }

  const showSkeleton = loading || !loaded;

  return (
    <div
      className="
        relative w-full overflow-hidden bg-gray-700 rounded-[10px]
        before:block before:pt-[26.5%] md:before:pt-[20%]
      "
    >
      {showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      )}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width:768px)" srcSet={desktopSrc} />
        <img
          src={mobileSrc}
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

export default MusicBanner;
