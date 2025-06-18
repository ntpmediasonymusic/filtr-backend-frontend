import PlaylistCard from "./PlaylistCard";

/* eslint-disable react/prop-types */
const PlaylistsContainerGrid = ({ currentPlaylists }) => {
  return (
    <div className="2xl:flex 2xl:justify-center 2xl:w-[100%]">
      <div className="2xl:max-w-[80%]">
        <div className="grid justify-items-center md:px-0 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[14px] xl:gap-x-[24px] gap-y-[30px]">
          {currentPlaylists.length > 0 &&
            currentPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.playlistName}
                playlistName={playlist.playlistName}
                urlPlaylist={playlist.urlPlaylist}
                urlCoverImage={playlist.urlCoverImage}
                isFavorite={playlist.isFavorite}
              />
            ))}
        </div>
        {currentPlaylists.length <= 0 && (
          <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center">
            No hay playlists disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistsContainerGrid;
