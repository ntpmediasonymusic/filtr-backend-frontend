import { useMemo } from "react";
import merchData from "../../data/merch-demo.json";
import { normalizeProducts } from "../../utils/merch";

// Fuente de datos aislada: hoy lee el JSON demo, mañana puede reemplazarse
// por un fetch a Shopify sin tocar los componentes que consumen este hook.
export default function useMerchProducts() {
  return useMemo(() => {
    const collection = merchData?.collection ?? {};
    return {
      categories: collection.categories ?? [],
      sortOptions: collection.sortOptions ?? [],
      availabilityOptions: collection.filters?.availability ?? [],
      products: normalizeProducts(collection.products ?? []),
    };
  }, []);
}
