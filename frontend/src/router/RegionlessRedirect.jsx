import { Navigate, useLocation } from "react-router-dom";
import { detectAndStorePreferredRegion, getPreferredRegion } from "./RegionContext";
import { useEffect, useState } from "react";

export function RootRedirect() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const pref = getPreferredRegion(); 
    if (pref) {
      setTarget(`/${pref}`);
      return;
    }
    // No hay preferencia → detecta por GeoIP
    (async () => {
      const region = await detectAndStorePreferredRegion();
      setTarget(`/${region}`);
    })();
  }, []);

  if (!target) return null;
  return <Navigate to={target} replace />;
}

// Para rutas como "/moods" -> "/{region}/moods"
export function RegionlessRedirect() {
  const loc = useLocation();
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("filtr_region");
    if (stored) {
      setTarget(`/${stored}${loc.pathname}${loc.search}${loc.hash}`);
      return;
    }
    (async () => {
      const region = await detectAndStorePreferredRegion();
      setTarget(`/${region}${loc.pathname}${loc.search}${loc.hash}`);
    })();
  }, [loc]);

  if (!target) return null;
  return <Navigate to={target} replace />;
}
