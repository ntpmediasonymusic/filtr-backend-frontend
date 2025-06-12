/* eslint-disable react/prop-types */
// import { NavLink } from "react-router-dom";
import PlaylistCard from "../ui/PlaylistCard";

const MainCategoryPreview = ({ title, playlists }) => {
  return (
    <div className="xl:flex 2xl:justify-center justify-center">
      <div>
        {/* Título y Botón */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-montserrat font-bold text-sm md:text-2xl sm:text-lg text-white">
            {title}
          </h2>
          {/* <NavLink
            to={`/main-category?title=${encodeURIComponent(title)}`}
            className="text-[#00DAF0] text-xs md:text-lg sm:text-sm hover:text-[#adf7ff] underline underline-offset-4"
          >
            Ver todos
          </NavLink> */}
        </div>

        {/* Contenedor de imágenes */}
        <div className="flex justify-between 2xl:justify-center space-x-6 overflow-x-auto pb-2">
          {playlists.slice(0, 10).map((playlist) => (
            <PlaylistCard
              key={playlist.playlistName}
              playlistName={playlist.playlistName}
              urlPlaylist={playlist.urlPlaylist}
              urlCoverImage={playlist.urlCoverImage}
              isFavorite={playlist.isFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCategoryPreview;
