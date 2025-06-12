import { useRef, useEffect, useState } from "react";
import TrendingPlaylistCard from "./TrendingPlaylistCard";

/* eslint-disable react/prop-types */
const TrendingPlaylistsContainerGrid = ({ currentPlaylists }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Función para verificar si se puede hacer scroll
  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
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

  useEffect(() => {
    checkScrollButtons();
  }, [currentPlaylists]);

  const scrollToLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollDistance = Math.min(container.scrollLeft, 400);
    
    container.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth'
    });
  };

  const scrollToRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const maxScroll = container.scrollWidth - container.clientWidth;
    const remainingScroll = maxScroll - container.scrollLeft;
    const scrollDistance = Math.min(remainingScroll, 400);
    
    container.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
  };

  if (currentPlaylists.length <= 0) {
    return (
      <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center">
        No hay playlists disponibles.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-hidden">
        <div
          ref={scrollContainerRef}
          className={`flex gap-6 pb-4 overflow-x-auto cursor-grab select-none transition-all duration-300 ease-out ${
            hasScrolled ? 'pl-0' : 'pl-6'
          } pr-6`}
          style={{ 
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {currentPlaylists.map((playlist, index) => (
            <TrendingPlaylistCard
              key={playlist.playlistName}
              index={index + 1}
              playlistName={playlist.playlistName}
              urlPlaylist={playlist.urlPlaylist}
              urlCoverImage={playlist.urlCoverImage}
              isFavorite={playlist.isFavorite}
            />
          ))}
        </div>
        <div className="w-full flex justify-end mt-2 pr-6">
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
    </div>
  );
};

export default TrendingPlaylistsContainerGrid;