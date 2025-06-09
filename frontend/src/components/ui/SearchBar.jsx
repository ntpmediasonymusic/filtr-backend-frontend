/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  searchTerm,
  handleSearchChange,
  searchSuggestions,
  handleSuggestionClick,
  searchRef,
  clearSuggestions,
}) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSuggestions, searchRef]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-sm md:text-lg" />
        <input
          type="text"
          placeholder="Buscar playlists..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 text-sm md:text-lg text-white rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      {searchSuggestions.length > 0 && (
        <ul className="absolute z-5 bg-gray-900 text-white w-full rounded-lg mt-1 shadow-lg max-h-50 overflow-y-auto">
          {searchSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 md:py-3 text-sm md:text-lg hover:bg-pink-600 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
