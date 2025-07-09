import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeaderCarousel = () => {
  const imageMap = [
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-1.jpg",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-1.jpg",
      alt: "Día del Padre",
      link: "https://open.spotify.com/playlist/16f6EeKTcW1JyPAewb52I1",
    },
    {
      desktop:
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-2.jpg",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-2.jpg",
      alt: "Pride Day",
      link: "https://open.spotify.com/playlist/4zi1xjOHKiQh5G8ancxArF",
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
        "/assets/images/home-page-banner/desktop/home-page-banner-desktop-4.jpg",
      mobile:
        "/assets/images/home-page-banner/mobile/home-page-banner-mobile-4.jpg",
      alt: "Hip-Hop",
      link: "https://open.spotify.com/playlist/2tX56rjkc0SlJ8DNhGtkDZ?si=39f0ba5ddf2e4297&nd=1&dlsi=b9c5031430ed4db0",
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
        showArrows={true}
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
          <div key={i} className="flex items-center justify-center">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <picture className="w-full">
                  <source media="(min-width:768px)" srcSet={desktop} />
                  <img
                    src={mobile}
                    alt={alt}
                    className="w-full object-cover object-center max-h-[600px]"
                    loading="lazy"
                  />
                </picture>
              </a>
            ) : (
              <picture className="w-full">
                <source media="(min-width:768px)" srcSet={desktop} />
                <img
                  src={mobile}
                  alt={alt}
                  className="w-full object-cover object-center max-h-[600px]"
                  loading="lazy"
                />
              </picture>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeaderCarousel;