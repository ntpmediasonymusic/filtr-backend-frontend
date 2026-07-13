import { useEffect, useMemo, useState } from "react";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";
import PageHeader from "../components/ui/PageHeader";
import MerchCategoryNav from "../components/merch/MerchCategoryNav";
import MerchFilters from "../components/merch/MerchFilters";
import MerchProductGrid from "../components/merch/MerchProductGrid";
import MerchEmptyState from "../components/merch/MerchEmptyState";
import useMerchProducts from "../hooks/merch/useMerchProducts";
import {
  getUniqueArtists,
  filterByCategory,
  filterByArtist,
  filterByAvailability,
  filterByPriceRange,
  sortProducts,
  countByAvailability,
} from "../utils/merch";

const DEFAULT_CATEGORY = "vinyl";
const DEFAULT_SORT = "date_descending";
const EMPTY_CATEGORIES = ["accessories", "cd"];

const CATEGORY_TITLES = {
  vinyl: "Vinilos",
  accessories: "Accesorios",
  cd: "CD",
};

const Merch = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { searchQuery } = useSearch();
  const { categories, sortOptions, availabilityOptions, products } =
    useMerchProducts();

  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [activeArtist, setActiveArtist] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [sortValue, setSortValue] = useState(DEFAULT_SORT);

  const artists = useMemo(() => getUniqueArtists(products), [products]);

  const handleSelectCategory = (categoryId) => {
    setActiveArtist(null);
    setActiveCategory(categoryId);
  };

  const handleSelectArtist = (artist) => {
    setActiveArtist(artist);
  };

  const handleClearFilters = () => {
    setAvailability(null);
    setPriceRange({ min: null, max: null });
  };

  const baseProducts = useMemo(() => {
    if (activeArtist) return filterByArtist(products, activeArtist.slug);
    return filterByCategory(products, activeCategory);
  }, [products, activeCategory, activeArtist]);

  const availabilityCounts = useMemo(
    () => countByAvailability(baseProducts),
    [baseProducts],
  );

  const filteredProducts = useMemo(() => {
    let result = baseProducts;
    result = filterByAvailability(result, availability);
    result = filterByPriceRange(result, priceRange.min, priceRange.max);
    result = sortProducts(result, sortValue);
    return result;
  }, [baseProducts, availability, priceRange, sortValue]);

  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  const categoryTitle = activeArtist
    ? activeArtist.name
    : CATEGORY_TITLES[activeCategory] ?? "Merch";
  const isEmptyCategory =
    !activeArtist && EMPTY_CATEGORIES.includes(activeCategory);
  const hasActiveFilters =
    !!availability || priceRange.min != null || priceRange.max != null;

  const resultCountLabel =
    filteredProducts.length === 1
      ? "1 producto"
      : `${filteredProducts.length} productos`;

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg="Merch oficial de tus artistas favoritos" />
      </div>

      <div className="flex flex-col px-4 md:px-10 pb-[50px] gap-6 md:gap-8">
        <MerchCategoryNav
          categories={categories}
          artists={artists}
          activeCategory={activeCategory}
          activeArtist={activeArtist}
          onSelectCategory={handleSelectCategory}
          onSelectArtist={handleSelectArtist}
        />

        <h2 className="font-montserrat font-bold text-white text-lg md:text-[28px]">
          {categoryTitle}
        </h2>

        {!isEmptyCategory && (
          <MerchFilters
            availabilityOptions={availabilityOptions}
            availabilityCounts={availabilityCounts}
            selectedAvailability={availability}
            onAvailabilityChange={setAvailability}
            priceMin={priceRange.min}
            priceMax={priceRange.max}
            onPriceApply={setPriceRange}
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={setSortValue}
            resultCountLabel={resultCountLabel}
          />
        )}

        {isEmptyCategory ? (
          <MerchEmptyState message="No hay productos disponibles en esta categoría por el momento." />
        ) : filteredProducts.length === 0 ? (
          <MerchEmptyState
            message="No se encontraron productos con los filtros seleccionados."
            actionLabel={hasActiveFilters ? "Limpiar filtros" : undefined}
            onAction={hasActiveFilters ? handleClearFilters : undefined}
          />
        ) : (
          <MerchProductGrid products={filteredProducts} />
        )}
      </div>
    </>
  );
};

export default Merch;
