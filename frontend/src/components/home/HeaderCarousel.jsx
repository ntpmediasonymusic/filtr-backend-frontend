/* eslint-disable react/prop-types */
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeaderCarousel = () => {
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
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-3.jpg",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-3.jpg",
      alt: "Girl Power",
      link: "https://open.spotify.com/playlist/1Jx7AdqyAGUMWBavwSN5vt?si=5ef950e9c0ef42b4&nd=1&dlsi=fe9169f829384cd8",
    },
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-7.png",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-7.png",
      alt: "Girl Power",
      link: "https://www.somosfiltr.com/prizes",
    },
  ];

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
        {imageMap.map(({ desktop, mobile, alt, link }, i) => (
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
                 before:block before:pt-[20.2%] rounded-none"
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
