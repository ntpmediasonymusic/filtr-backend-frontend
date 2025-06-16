/* eslint-disable react/prop-types */
import PlaylistsContainerGrid from "../ui/PlaylistsContainerGrid";

const SearchResults = ({ searchResults, searchQuery }) => {
  if (!searchQuery) return null;

  if (searchResults.length === 0) {
    return (
      <div className="px-8 py-10">
        <p className="text-gray-400 text-center text-lg">
          No se encontraron resultados para {searchQuery}
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      <h2 className="text-white text-2xl font-bold mb-6">
        Resultados de búsqueda para {searchQuery}
      </h2>
      <p className="text-gray-400 mb-8">
        {searchResults.length} {searchResults.length === 1 ? 'playlist encontrada' : 'playlists encontradas'}
      </p>
      <PlaylistsContainerGrid currentPlaylists={searchResults} />
    </div>
  );
};

export default SearchResults;