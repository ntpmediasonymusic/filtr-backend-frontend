/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";

export default function GenresHeader({
  genres,
  selectedGenre,
  setSelectedGenre,
  filter = false,
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Actualizar visibilidad de los botones
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateButtons = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth - 1
      );
    };

    updateButtons();
    container.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      container.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [genres]);

  // Drag to scroll en desktop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX, scrollStart;

    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      isDragging = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX;
      scrollStart = container.scrollLeft;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      container.scrollLeft = scrollStart - dx;
    };
    const onUp = () => {
      isDragging = false;
      container.classList.remove("cursor-grabbing");
    };

    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const scrollByOffset = (offset) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleClick = (genre) => {
    if (selectedGenre?.name === genre.name) setSelectedGenre(null);
    else setSelectedGenre(genre);
  };

  return (
    <div className="relative w-full">
      {filter && genres && genres.length > 0 && (
        <h2 className="text-2xl ml-6 sm:text-3xl font-bold mb-6 text-white">
          Elige un género
        </h2>
      )}

      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="grid grid-flow-col auto-cols-min grid-rows-2 gap-2 md:gap-4 overflow-x-auto px-2 py-2 cursor-grab scrollbar-hide"
        >
          {genres.map((genre) => {
            const isSelected = selectedGenre?.name === genre.name;
            return (
              <div
                key={genre.name}
                onClick={() => handleClick(genre)}
                onMouseDown={(e) => e.stopPropagation()}
                className={`cursor-pointer rounded-2xl md:rounded-3xl box-border border-2 md:border-4
                  w-[110px] min-w-[110px]
                  sm:w-[180px] sm:min-w-[180px]
                  md:w-[160px] md:min-w-[160px]
                  lg:w-[200px] lg:min-w-[200px]
                  xl:w-[240px] xl:min-w-[240px]
                  transform-gpu overflow-hidden
                  h-16 sm:h-24 md:h-24 lg:h-28 xl:h-32
                  ${
                    isSelected
                      ? "border-[#ffffff] scale-105 relative z-10"
                      : "border-transparent scale-100"
                  }
                  hover:border-[#ffffff] hover:scale-105 transition-all duration-300
                `}
              >
                <GenreImage
                  desktop={genre.desktopImage}
                  mobile={genre.mobileImage}
                  alt={genre.name}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de navegación con inline SVG */}
      {genres.length > 3 && (
        <>
          <button
            onClick={() => scrollByOffset(-300)}
            disabled={!canScrollLeft}
            className={`absolute z-12 top-1/2 left-0 transform -translate-y-1/2 bg-[#252733] p-0.5 md:p-2 w-10 h-10 md:w-16 md:h-16 rounded-full transition-opacity
            ${
              canScrollLeft
                ? "hover:opacity-80"
                : "opacity-50 cursor-not-allowed"
            }
          `}
          >
            {/* SVG Prev */}
            <svg
              className="w-full h-full"
              viewBox="0 0 44 44"
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
          </button>
          <button
            onClick={() => scrollByOffset(300)}
            disabled={!canScrollRight}
            className={`absolute z-12 top-1/2 right-0 transform -translate-y-1/2 bg-[#252733] p-0.5 md:p-2 w-10 h-10 md:w-16 md:h-16 rounded-full transition-opacity ml-2
            ${
              canScrollRight
                ? "hover:opacity-80"
                : "opacity-50 cursor-not-allowed"
            }
          `}
          >
            {/* SVG Next */}
            <svg
              className="w-full h-full"
              viewBox="0 0 44 44"
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
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Helper component to render each genre image
 * with preserved space, skeleton and fade-in.
 */
function GenreImage({ desktop, mobile, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-gray-700">
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
