import TrendingPlaylistCard from "./TrendingPlaylistCard";

/* eslint-disable react/prop-types */
const TrendingPlaylistsContainerGrid = ({ currentPlaylists }) => {

  if (currentPlaylists.length <= 0) {
    return (
      <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center">
        No hay playlists disponibles.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 py-6 px-6">
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
  );
};

export default TrendingPlaylistsContainerGrid;