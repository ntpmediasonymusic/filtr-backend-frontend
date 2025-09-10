import TrendingPlaylistCard from "./TrendingPlaylistCard";

/* NUEVO: import del carrusel y estilos */
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

/* eslint-disable react/prop-types */
const TrendingPlaylistsContainerGrid = ({ currentPlaylists }) => {
  if (currentPlaylists.length <= 0) {
    return (
      <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center">
        No hay playlists disponibles.
      </p>
    );
  }

  /* NUEVO: flechas como en HeaderCarousel */
  const PrevArrow = () => (
    <svg viewBox="0 0 44 44" className="w-full h-full">
      <g opacity="0.8">
        <rect width="44" height="44" rx="22" fill="#3d4156" />
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
    <svg viewBox="0 0 44 44" className="w-full h-full">
      <g opacity="0.8">
        <rect width="44" height="44" rx="22" fill="#3d4156" />
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
    <div className="flex flex-col items-center">
      {/* MOBILE: lista en una sola columna (igual que ahora) */}
      <div className="w-full flex flex-col items-center gap-6 py-6 px-6 md:hidden">
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

      {/* DESKTOP: carrusel con una card por slide */}
      <div className="hidden md:block w-full max-w-[1200px] py-6 px-6">
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
                  className="absolute z-10 left-1 top-1/2 -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-10 h-10 md:w-16 md:h-16"
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
                  className="absolute z-10 right-1 top-1/2 -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-10 h-10 md:w-16 md:h-16"
                  aria-label="Siguiente"
                >
                  <NextArrow />
                </button>
              )
            }
          >
            {currentPlaylists.map((playlist, index) => (
              <div
                key={playlist.playlistName}
                className="flex items-center justify-center w-full pb-15"
              >
                {/* Centramos la card; mantiene su max-w en el propio componente */}
                <TrendingPlaylistCard
                  index={index + 1}
                  playlistName={playlist.playlistName}
                  urlPlaylist={playlist.urlPlaylist}
                  urlCoverImage={playlist.urlCoverImage}
                  isFavorite={playlist.isFavorite}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default TrendingPlaylistsContainerGrid;
