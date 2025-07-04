/* eslint-disable react/prop-types */
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
      <picture className="w-full block rounded-[10px] overflow-hidden">
        {/* Imagen de escritorio para pantallas md en adelante */}
        <source media="(min-width: 768px)" srcSet={images.desktop} />
        {/* Imagen de móvil para pantallas <768px */}
        <img
          src={images.mobile}
          alt={`Banner ${type}`}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </picture>
    </div>
  );
};

export default MusicBanner;
