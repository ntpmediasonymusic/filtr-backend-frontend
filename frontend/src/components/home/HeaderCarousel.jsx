/* eslint-disable react/prop-types */
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRegion } from "../../router/RegionContext";

const HeaderCarousel = () => {
  const { region } = useRegion();

  const imageMap = [
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-5.png",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-5.png",
      alt: "Y2K",
      link: "https://open.spotify.com/playlist/2XvmYFOs59zc1F1hWTqwgJ",
    },
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-4.jpg",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-4.jpg",
      alt: "Hip-Hop",
      link: "https://open.spotify.com/playlist/2tX56rjkc0SlJ8DNhGtkDZ?si=39f0ba5ddf2e4297&nd=1&dlsi=b9c5031430ed4db0",
    },
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-6.png",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-6.png",
      alt: "Vacaciones",
      link: "https://open.spotify.com/playlist/1zZuDCC032tiepZ5RjQlt3?si=02164e54608443fc&nd=1&dlsi=fc74bce0c9294680",
    },
  ];

  const imageMapDo = [
    {
      desktop:
        "/assets/images/home-page-banner/do/desktop/home-page-banner-desktop-1.png",
      mobile:
        "/assets/images/home-page-banner/do/mobile/home-page-banner-mobile-1.png",
      alt: "Barbarella",
      link: "https://open.spotify.com/playlist/2VhQNYOiTfeVcoL5cyV5I2?si=686bd1a9178049ec&nd=1&dlsi=c14c28bde5024eda",
    },
    {
      desktop:
        "/assets/images/prizes-banner-header/do/desktop/prizes-banner-header-desktop-1.png",
      mobile:
        "/assets/images/prizes-banner-header/do/mobile/prizes-banner-header-mobile-1.png",
      alt: "Concursos do",
      link: "https://www.somosfiltr.com/prizes",
    },
    {
      desktop:
        "/assets/images/home-page-banner/do/desktop/home-page-banner-desktop-2.png",
      mobile:
        "/assets/images/home-page-banner/do/mobile/home-page-banner-mobile-2.png",
      alt: "3. Top RD",
      link: "https://open.spotify.com/playlist/4eGkMMoNpngwyZJ9fNlnV5?si=f1e2357123cf43ce&nd=1&dlsi=af7adb77ff684cfd",
    },
    {
      desktop:
        "/assets/images/home-page-banner/do/desktop/home-page-banner-desktop-3.png",
      mobile:
        "/assets/images/home-page-banner/do/mobile/home-page-banner-mobile-3.png",
      alt: "Dembow",
      link: "https://open.spotify.com/playlist/2njtU0pVZvudkZFmsdnGvu?si=fa13270b8dc74bef&nd=1&dlsi=ef3f0e2f858a474a",
    },
  ];
  const imageMapRegion = region === "do" ? imageMapDo : imageMap;

  const PrevArrow = () => (
    <svg
      viewBox="0 0 44 44"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <rect width="44" height="44" rx="22" fill="#252733" />
        <path
          d="M29 22H15M15 22L22 29M15 22L22 15"
          stroke="#E1E1E2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
  const NextArrow = () => (
    <svg
      viewBox="0 0 44 44"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <rect width="44" height="44" rx="22" fill="#252733" />
        <path
          d="M15 22H29M29 22L22 15M29 22L22 29"
          stroke="#E1E1E2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  return (
    <div className="relative">
      <Carousel
        showArrows
        showIndicators
        infiniteLoop
        autoPlay
        interval={5000}
        showThumbs={false}
        showStatus={false}
        swipeable
        emulateTouch
        dynamicHeight={false}
        renderArrowPrev={(onClick, hasPrev) =>
          hasPrev && (
            <button
              onClick={onClick}
              className="absolute z-12 left-1 top-1/2 transform -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-10 h-10 md:w-16 md:h-16"
              aria-label="Anterior"
            >
              <PrevArrow />
            </button>
          )
        }
        renderArrowNext={(onClick, hasNext) =>
          hasNext && (
            <button
              onClick={onClick}
              className="absolute z-12 right-1 top-1/2 transform -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-10 h-10 md:w-16 md:h-16"
              aria-label="Siguiente"
            >
              <NextArrow />
            </button>
          )
        }
      >
        {imageMapRegion.map(({ desktop, mobile, alt, link }, i) => (
          <div key={i} className="flex items-center justify-center w-full">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <HeaderCarouselImage
                  desktop={desktop}
                  mobile={mobile}
                  alt={alt}
                />
              </a>
            ) : (
              <HeaderCarouselImage
                desktop={desktop}
                mobile={mobile}
                alt={alt}
              />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

function HeaderCarouselImage({ desktop, mobile, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-700
                 before:block before:pt-[26.5%] md:before:pt-[20.2%] rounded-none"
    >
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

export default HeaderCarousel;
