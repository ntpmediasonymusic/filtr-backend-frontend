/* eslint-disable react/prop-types */
import MerchDropdown from "./MerchDropdown";

export default function MerchCategoryNav({
  categories,
  artists,
  activeCategory,
  activeArtist,
  onSelectCategory,
  onSelectArtist,
}) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide md:justify-center border-b border-white/10 pb-3">
      {categories.map((category) => {
        if (category.type === "dropdown") {
          const isActive = !!activeArtist;
          return (
            <MerchDropdown
              key={category.id}
              label={category.label}
              usePortal
              panelClassName="min-w-[180px]"
              renderLabel={() => (
                <span
                  className={`uppercase tracking-wide text-sm font-medium ${
                    isActive ? "text-[#00DAF0]" : "text-gray-300"
                  }`}
                >
                  {category.label}
                </span>
              )}
            >
              {({ close }) => (
                <ul className="flex flex-col max-h-64 overflow-y-auto">
                  {artists.length === 0 && (
                    <li className="text-sm text-gray-400 px-2 py-1.5">
                      Sin artistas disponibles
                    </li>
                  )}
                  {artists.map((artist) => (
                    <li key={artist.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectArtist(artist);
                          close();
                        }}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
                          activeArtist?.slug === artist.slug
                            ? "bg-white/15 text-[#00DAF0]"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {artist.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </MerchDropdown>
          );
        }

        const isActive = !activeArtist && activeCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`shrink-0 px-3 py-2 text-sm font-medium uppercase tracking-wide rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0] ${
              isActive
                ? "text-[#00DAF0] border-b-2 border-[#00DAF0]"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </nav>
  );
}
