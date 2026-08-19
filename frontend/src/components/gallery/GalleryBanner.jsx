/* eslint-disable react/prop-types */
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { HERO_GRADIENT } from "./galleryPresentation";

// Banner/carrusel reutilizado tanto en el catalogo de Galeria como en el
// detalle de evento. Cada slide puede traer `backgroundImage`; mientras no
// exista una definitiva, se usa un gradiente coherente con la marca (esa es
// la propiedad a reemplazar mas adelante por la portada real).
const PrevArrow = () => (
  <svg viewBox="0 0 44 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <rect width="44" height="44" rx="22" fill="#252733" />
      <path d="M29 22H15M15 22L22 29M15 22L22 15" stroke="#E1E1E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

const NextArrow = () => (
  <svg viewBox="0 0 44 44" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <rect width="44" height="44" rx="22" fill="#252733" />
      <path d="M15 22H29M29 22L22 15M29 22L22 29" stroke="#E1E1E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

function GalleryBannerSlide({ eyebrow, title, description, backgroundImage, meta = [] }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[10px] before:block before:pt-[48%] xs:before:pt-[38%] sm:before:pt-[24%] md:before:pt-[17%]"
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { backgroundImage: HERO_GRADIENT }
      }
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <div className="absolute inset-0 flex flex-col justify-end gap-1 sm:gap-2 p-4 sm:p-6 md:p-8">
        {meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {meta.map((chip) => (
              <span
                key={chip.label}
                className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${chip.className || "bg-white/15 text-white"}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        )}

        {eyebrow && (
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#00DAF0]">
            {eyebrow}
          </span>
        )}

        <h1 className="text-white font-montserrat font-black text-xl sm:text-2xl md:text-3xl leading-tight">
          {title}
        </h1>

        {description && (
          <p className="hidden xs:block text-white/85 text-xs sm:text-sm md:text-base max-w-2xl line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function GalleryBanner({ slides = [] }) {
  const usable = slides.filter(Boolean);
  if (usable.length === 0) return null;

  const showControls = usable.length > 1;

  return (
    <div className="relative">
      <Carousel
        showArrows={showControls}
        showIndicators={showControls}
        infiniteLoop={showControls}
        autoPlay={showControls}
        interval={6000}
        showThumbs={false}
        showStatus={false}
        swipeable={showControls}
        emulateTouch={showControls}
        dynamicHeight={false}
        renderArrowPrev={(onClick, hasPrev) =>
          hasPrev && (
            <button
              onClick={onClick}
              className="absolute z-12 left-1 top-1/2 -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-8 h-8 md:w-14 md:h-14 cursor-pointer"
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
              className="absolute z-12 right-1 top-1/2 -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-8 h-8 md:w-14 md:h-14 cursor-pointer"
              aria-label="Siguiente"
            >
              <NextArrow />
            </button>
          )
        }
      >
        {usable.map((slide, idx) => (
          <GalleryBannerSlide key={slide.id || idx} {...slide} />
        ))}
      </Carousel>
    </div>
  );
}
