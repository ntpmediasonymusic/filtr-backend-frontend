/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import PlaylistCard from "../ui/PlaylistCard";

export default function MainCategoryPreview({ title, playlists }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Actualiza estado de botones cada vez que haya scroll o resize
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const update = () => {
      setCanScrollLeft(c.scrollLeft > 0);
      setCanScrollRight(c.scrollLeft + c.clientWidth < c.scrollWidth - 1);
    };
    update();
    c.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      c.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [playlists]);

  // Drag to scroll en desktop
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    let isDown = false,
      startX = 0,
      scrollStart = 0;
    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      isDown = true;
      c.classList.add("cursor-grabbing");
      startX = e.pageX;
      scrollStart = c.scrollLeft;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      c.scrollLeft = scrollStart - dx;
    };
    const onUp = () => {
      isDown = false;
      c.classList.remove("cursor-grabbing");
    };
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const scrollByOffset = (offset) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  // SVG de flecha izq/dcha
  const ArrowLeft = () => (
    <svg viewBox="0 0 44 44" className="w-full h-full">
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
  const ArrowRight = () => (
    <svg viewBox="0 0 44 44" className="w-full h-full">
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
    <div className="relative w-full">
      {/* Título */}
      <div className="flex justify-between items-center mb-4 px-2 md:px-0">
        <h2 className="font-montserrat font-bold text-lg md:text-2xl text-white">
          {title}
        </h2>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-4 md:gap-8 md:justify-center overflow-x-auto py-2 px-2 scrollbar-hide cursor-grab"
          style={{ scrollBehavior: "smooth" }}
        >
          {playlists.slice(0, 10).map((pl) => (
            <div key={pl.playlistName} className="flex-shrink-0">
              <PlaylistCard
                playlistName={pl.playlistName}
                urlPlaylist={pl.urlPlaylist}
                urlCoverImage={pl.urlCoverImage}
                isFavorite={pl.isFavorite}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flechas de navegación */}
      {playlists.length > 3 && (
        <>
          <button
            onClick={() => scrollByOffset(-300)}
            disabled={!canScrollLeft}
            className={`
              absolute z-10 top-1/2 left-0 -translate-y-1/2
              w-10 h-10 md:w-12 md:h-12 p-1
              bg-[#252733] rounded-full transition-opacity
              ${
                canScrollLeft
                  ? "hover:opacity-80"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
            aria-label="Anterior"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => scrollByOffset(300)}
            disabled={!canScrollRight}
            className={`
              absolute z-10 top-1/2 right-0 -translate-y-1/2
              w-10 h-10 md:w-12 md:h-12 p-1
              bg-[#252733] rounded-full transition-opacity
              ${
                canScrollRight
                  ? "hover:opacity-80"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
            aria-label="Siguiente"
          >
            <ArrowRight />
          </button>
        </>
      )}
    </div>
  );
}
