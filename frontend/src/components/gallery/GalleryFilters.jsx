/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/SearchIcon";
import { IoClose } from "react-icons/io5";

const selectClass =
  "text-xs sm:text-sm md:text-base rounded-xl bg-[#131517] border border-white/15 text-white px-3 py-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]";

export default function GalleryFilters({
  search,
  onSearchChange,
  eventTypeOptions = [],
  eventType,
  onEventTypeChange,
  countryOptions = [],
  country,
  onCountryChange,
  artistOptions = [],
  artist,
  onArtistChange,
  yearOptions = [],
  year,
  onYearChange,
  hasActiveFilters,
  onClear,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Chips de tipo de evento */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          type="button"
          onClick={() => onEventTypeChange("all")}
          className={`shrink-0 px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-lg transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
            eventType === "all"
              ? "bg-[#00DAF0] text-black"
              : "bg-white/5 text-gray-300 hover:text-white border border-white/10"
          }`}
        >
          Todos
        </button>
        {eventTypeOptions.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onEventTypeChange(type)}
            className={`shrink-0 px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-lg transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
              eventType === type
                ? "bg-[#00DAF0] text-black"
                : "bg-white/5 text-gray-300 hover:text-white border border-white/10"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Busqueda + selects */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 min-w-0 flex items-center bg-[#131517] rounded-full px-2 sm:px-4 py-2 gap-1 sm:gap-2 border-2 border-[#00DAF0] w-full md:w-80">
            <SearchIcon className="text-[#00DAF0] w-full max-w-6 min-w-3" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por evento o artista"
              className="flex-1 min-w-0 truncate bg-transparent focus:outline-none text-white placeholder:text-gray-400 text-xs sm:text-sm md:text-base"
            />
          </div>
          {search ? (
            <button
              onClick={() => onSearchChange("")}
              className="rounded-full border border-[#00DAF0] bg-[#00DAF0] p-3 text-lg hover:bg-[#00DAF0]/80 transition shrink-0 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <IoClose />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className={selectClass}
            aria-label="Filtrar por país"
          >
            <option value="all">País</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={artist}
            onChange={(e) => onArtistChange(e.target.value)}
            className={selectClass}
            aria-label="Filtrar por artista"
          >
            <option value="all">Artista</option>
            {artistOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className={selectClass}
            aria-label="Filtrar por año"
          >
            <option value="all">Año</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg bg-[#CA249C] text-white hover:opacity-90 transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
