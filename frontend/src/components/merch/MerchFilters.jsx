/* eslint-disable react/prop-types */
import MerchDropdown from "./MerchDropdown";
import MerchPriceFilter from "./MerchPriceFilter";

export default function MerchFilters({
  availabilityOptions,
  availabilityCounts,
  selectedAvailability,
  onAvailabilityChange,
  priceMin,
  priceMax,
  onPriceApply,
  sortOptions,
  sortValue,
  onSortChange,
  resultCountLabel,
}) {
  const selectedLabel =
    availabilityOptions.find((opt) => opt.value === selectedAvailability)?.label ??
    "Disponibilidad";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <MerchDropdown label={selectedLabel}>
          {({ close }) => (
            <ul className="flex flex-col min-w-[190px]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onAvailabilityChange(null);
                    close();
                  }}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
                    !selectedAvailability
                      ? "bg-white/15 text-[#00DAF0]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Todos
                </button>
              </li>
              {availabilityOptions.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onAvailabilityChange(opt.value);
                      close();
                    }}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition flex justify-between gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
                      selectedAvailability === opt.value
                        ? "bg-white/15 text-[#00DAF0]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-gray-400">
                      ({availabilityCounts[opt.value] ?? 0})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </MerchDropdown>

        <MerchPriceFilter min={priceMin} max={priceMax} onApply={onPriceApply} />
      </div>

      <div className="flex items-center gap-3 flex-wrap md:justify-end">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          Ordenar por
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-2 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.value} className="bg-[#282828] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {resultCountLabel}
        </span>
      </div>
    </div>
  );
}
