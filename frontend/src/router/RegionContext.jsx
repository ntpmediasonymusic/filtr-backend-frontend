/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { REGIONS, isValidRegion } from "../utils/region";

const Ctx = createContext(null);

export function RegionProvider({ region, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const value = useMemo(
    () => ({
      region,
      regions: REGIONS,
      setRegion: (next) => {
        if (!isValidRegion(next)) return;
        // guarda preferencia
        try {
          localStorage.setItem("filtr_region", next);
        } catch { /* empty */ }
        // preserva subruta
        const parts = location.pathname.split("/").filter(Boolean);
        parts[0] = next;
        navigate("/" + parts.join("/") + location.search + location.hash, {
          replace: false,
        });
      },
    }),
    [region, navigate, location]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Helper opcional reutilizable:
// eslint-disable-next-line react-refresh/only-export-components
export function getPreferredRegion() {
  try {
    const r = localStorage.getItem("filtr_region");
    if (!r) {
      return null; 
    }
    const valid = isValidRegion(r) ? r : null;
    return valid;
  } catch (e) {
    console.log("[Region] error:", e);
    return null; 
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegion() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export async function detectAndStorePreferredRegion() {
  try {
    const { fetchCountryCode, mapCountryToRegion } = await import(
      "../utils/geo"
    );
    const iso2 = await fetchCountryCode();
    const region = mapCountryToRegion(iso2);
    localStorage.setItem("filtr_region", region);
    return region;
  } catch (e) {
    console.log("[GeoIP] error 'cr':", e);
    localStorage.setItem("filtr_region", "cr");
    return "cr";
  }
}