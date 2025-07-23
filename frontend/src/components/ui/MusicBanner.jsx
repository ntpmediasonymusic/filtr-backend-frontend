/* eslint-disable react/prop-types */
import { useState } from "react";

const MusicBanner = ({ type = "generos" }) => {
  // Mapeo de tipos a nombres de archivo reales
  const imageMap = {
    generos: {
      desktop:
        "/assets/images/page-banner-header/desktop/generos-page-banner-header-desktop.png",
      mobile:
        "/assets/images/page-banner-header/mobile/generos-page-banner-header-mobile.png",
    },
    moods: {
      desktop:
        "/assets/images/page-banner-header/desktop/moods-page-banner-header-desktop.png",
      mobile:
        "/assets/images/page-banner-header/mobile/moods-page-banner-header-mobile.png",
    },
    trending: {
      desktop:
        "/assets/images/page-banner-header/desktop/tranding-page-banner-header-desktop.png",
      mobile:
        "/assets/images/page-banner-header/mobile/trending-page-banner-header-mobile.png",
    },
    shows: {
      desktop:
        "/assets/images/shows-banner-header/desktop/shows-banner-header-desktop-1.png",
      mobile:
        "/assets/images/shows-banner-header/mobile/shows-banner-header-mobile-1.png",
    },
    premios: {
      desktop:
        "/assets/images/page-banner-header/desktop/premios-page-banner-header-desktop.png",
      mobile:
        "/assets/images/page-banner-header/mobile/premios-page-banner-header-mobile.png",
    },
  };

  const images = imageMap[type] || imageMap.generos;

  return (
    <div className="px-6 pb-5 md:pb-10">
      <MusicBannerImage
        desktop={images.desktop}
        mobile={images.mobile}
        alt={`Banner ${type}`}
      />
    </div>
  );
};

function MusicBannerImage({ desktop, mobile, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="
        relative w-full overflow-hidden bg-gray-700 rounded-[10px]
        before:block before:pt-[26.5%] md:before:pt-[20%]
      "
    >
      {/* Skeleton mientras carga */}
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

export default MusicBanner;
