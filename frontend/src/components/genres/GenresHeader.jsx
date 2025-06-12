/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";

export default function GenresHeader({
  genres,
  selectedGenre,
  setSelectedGenre,
  filter = false,
}) {
  const scrollContainerRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Función para verificar si se puede hacer scroll
  const checkScrollButtons = () => {
    const container = window.innerWidth >= 768 ? scrollContainerRef.current : mobileScrollRef.current;
    if (!container) return;

    const scrolled = container.scrollLeft > 0;
    setHasScrolled(scrolled);
    setCanScrollLeft(scrolled);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  // Manejar el drag del scroll en desktop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      // Solo activar drag en desktop
      if (window.innerWidth < 768) return;
      
      isDown = true;
      scrollContainer.classList.add("cursor-grabbing");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      e.preventDefault();
    };

    const handleMouseLeave = () => {
      isDown = false;
      scrollContainer.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
      checkScrollButtons();
    };

    checkScrollButtons();
    scrollContainer.addEventListener("scroll", checkScrollButtons);
    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollButtons);
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  // Manejar scroll en móvil
  useEffect(() => {
    const mobileContainer = mobileScrollRef.current;
    if (!mobileContainer) return;

    mobileContainer.addEventListener("scroll", checkScrollButtons);
    return () => {
      mobileContainer.removeEventListener("scroll", checkScrollButtons);
    };
  }, []);

  // Verificar botones cuando cambien los géneros
  useEffect(() => {
    checkScrollButtons();
  }, [genres]);

  const handleGenreClick = (genre) => {
    if (selectedGenre && selectedGenre.name === genre.name) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  const scrollToLeft = () => {
    const container = window.innerWidth >= 768 ? scrollContainerRef.current : mobileScrollRef.current;
    if (!container) return;
    
    const scrollDistance = Math.min(container.scrollLeft, 400);
    
    container.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth'
    });
  };

  const scrollToRight = () => {
    const container = window.innerWidth >= 768 ? scrollContainerRef.current : mobileScrollRef.current;
    if (!container) return;
    
    const maxScroll = container.scrollWidth - container.clientWidth;
    const remainingScroll = maxScroll - container.scrollLeft;
    const scrollDistance = Math.min(remainingScroll, 400);
    
    container.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
  };

  const renderGenreCard = (genre) => {
    const isSelected = selectedGenre && genre.name === selectedGenre.name;
    
    return (
      <div
        key={genre.name}
        onClick={() => handleGenreClick(genre)}
        onMouseDown={(e) => e.stopPropagation()}
        className={`
          cursor-pointer rounded-2xl md:rounded-3xl box-border border-2 md:border-4 
          w-[160px] min-w-[160px] 
          sm:w-[180px] sm:min-w-[180px]
          md:w-[160px] md:min-w-[160px] 
          lg:w-[200px] lg:min-w-[200px] 
          xl:w-[240px] xl:min-w-[240px] 
          transform-gpu overflow-hidden 
          h-20 sm:h-24 md:h-24 lg:h-28 xl:h-32
          ${isSelected ? "border-[#ffffff] scale-105 relative z-10" : "border-transparent scale-100"}
          hover:border-[#ffffff] hover:scale-105 transition-all duration-300
        `}
      >
        <picture>
          <source 
            media="(min-width: 768px)" 
            srcSet={genre.desktopImage}
          />
          <img 
            src={genre.mobileImage}
            alt={genre.name}
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
    );
  };

  return (
    <div className="w-full">
      {filter && genres && genres.length > 0 && (
        <h2 className="text-2xl sm:text-3xl ml-6 font-bold mb-6 text-white">
          Elige un género
        </h2>
      )}
      
      {/* Vista móvil - una fila con scroll */}
      <div className="md:hidden overflow-x-hidden overflow-y-visible">
        <div
          ref={mobileScrollRef}
          className={`flex gap-4 overflow-x-auto overflow-y-visible select-none pr-6 pt-2 pb-4 scrollbar-hide transition-all duration-300 ease-out ${
            hasScrolled ? 'pl-0' : 'pl-6'
          }`}
          style={{ 
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {genres.map(renderGenreCard)}
        </div>
      </div>

      {/* Vista desktop - exactamente 2 filas */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <div
            ref={scrollContainerRef}
            className="cursor-grab select-none scrollbar-hide lg:flex lg:justify-center lg:min-w-full"
            style={{ 
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "smooth",
            }}
          >
            <div className="px-6 py-4 inline-block">
              {/* Primera fila */}
              <div className="flex gap-4 mb-4">
                {genres.slice(0, Math.ceil(genres.length / 2)).map(renderGenreCard)}
              </div>
              {/* Segunda fila */}
              <div className="flex gap-4">
                {genres.slice(Math.ceil(genres.length / 2)).map(renderGenreCard)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="w-full flex justify-end mt-2 pr-4">
        <button
          onClick={scrollToLeft}
          disabled={!canScrollLeft}
          className={`${
            canScrollLeft 
              ? 'cursor-pointer hover:opacity-80' 
              : 'cursor-not-allowed opacity-50'
          } transition-opacity`}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8">
              <rect width="44" height="44" rx="22" fill="#252733" />
              <path d="M29 22H15M15 22L22 29M15 22L22 15" stroke="#E1E1E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </button>
        <button
          onClick={scrollToRight}
          disabled={!canScrollRight}
          className={`${
            canScrollRight 
              ? 'cursor-pointer hover:opacity-80' 
              : 'cursor-not-allowed opacity-50'
          } transition-opacity ml-2`}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8">
              <rect width="44" height="44" rx="22" fill="#252733" />
              <path d="M15 22H29M29 22L22 15M29 22L22 29" stroke="#E1E1E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}