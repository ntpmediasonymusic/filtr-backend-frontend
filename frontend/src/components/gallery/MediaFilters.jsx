/* eslint-disable react/prop-types */
const TABS = [
  { id: "all", label: "Todo" },
  { id: "image", label: "Fotos" },
  { id: "video", label: "Videos" },
];

export default function MediaFilters({ value, onChange, counts }) {
  return (
    <div className="flex items-center gap-2">
      {TABS.map((tab) => {
        const count = counts?.[tab.id];
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-lg transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
              active
                ? "bg-[#00DAF0] text-black"
                : "bg-white/5 text-gray-300 hover:text-white border border-white/10"
            }`}
          >
            {tab.label}
            {typeof count === "number" ? ` (${count})` : ""}
          </button>
        );
      })}
    </div>
  );
}
