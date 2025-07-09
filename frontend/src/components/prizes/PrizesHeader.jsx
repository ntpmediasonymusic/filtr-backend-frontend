import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PrizesHeader = () => {
  const imageMap = [
    {
      desktop:
        "/assets/images/prizes-banner-header/desktop/prizes-banner-header-desktop-1.png",
      mobile:
        "/assets/images/prizes-banner-header/mobile/prizes-banner-header-mobile-1.png",
      alt: "Shows Banner 1",
    },
    {
      desktop:
        "/assets/images/prizes-banner-header/desktop/prizes-banner-header-desktop-2.png",
      mobile:
        "/assets/images/prizes-banner-header/mobile/prizes-banner-header-mobile-2.png",
      alt: "Shows Banner 2",
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
            className="absolute z-12 left-1 top-1/2 transform -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-8 h-8 md:w-16 md:h-16"
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
            className="absolute z-12 right-1 top-1/2 transform -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-8 h-8 md:w-16 md:h-16"
            aria-label="Siguiente"
          >
            <NextArrow />
          </button>
        )
      }
    >
      {imageMap.map(({ desktop, mobile, alt, link }, idx) => {
        const content = (
          <picture className="w-full">
            <source media="(min-width:768px)" srcSet={desktop} />
            <img
              src={mobile}
              alt={alt}
              className="w-full object-cover object-center max-h-[600px] rounded-[10px]"
              loading="lazy"
            />
          </picture>
        );
        return (
          <div key={idx} className="flex items-center justify-center">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        );
      })}
    </Carousel>
  );
};

export default PrizesHeader;
