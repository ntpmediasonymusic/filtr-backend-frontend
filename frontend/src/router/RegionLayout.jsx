/* eslint-disable react/prop-types */
import { Outlet, useParams, Navigate, useLocation } from "react-router-dom";
import { detectAndStorePreferredRegion, RegionProvider } from "./RegionContext";
import CookieConsentBanner from "../components/ui/modal/CookieConsentBanner";
import NavMenu from "../components/ui/navMenu/NavMenu";
import Footer from "../components/ui/Footer";
import { isValidRegion, normalizeRegion } from "../utils/region";
import { GTMProvider } from "../context/GTMContext";
import { SearchProvider } from "../context/SearchContext";
import { PlaylistProvider } from "../context/PlaylistContext";
import { useEffect, useState } from "react";

import { HelmetProvider } from "react-helmet-async";
import SeoManager from "../seo/SeoManager";

export default function RegionLayout() {
  const { region } = useParams();
  const location = useLocation();
  const code = normalizeRegion(region);

  if (!isValidRegion(code)) {
    const stored = localStorage.getItem("filtr_region");

    // preserva subruta (evita bucles y respeta 1 segmento)
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    const restPath = segments.length <= 1 ? path : path.replace(/^\/[^/]+/, "");

    if (stored) {
      const next = `/${stored}${restPath}${location.search}${location.hash}`;
      return <Navigate to={next} replace />;
    }

    return (
      <DetectThenRedirect
        restPath={restPath}
        search={location.search}
        hash={location.hash}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#131517]">
      <RegionProvider region={code}>
        <GTMProvider gtmId="GTM-NW2SVN5N">
          <HelmetProvider>
            <SeoManager />
            <SearchProvider>
              <PlaylistProvider>
                <CookieConsentBanner />
                <NavMenu />
                <div className="flex-1 mt-[50px] md:mt-[80px]">
                  <Outlet />
                </div>
                <Footer />
              </PlaylistProvider>
            </SearchProvider>
          </HelmetProvider>
        </GTMProvider>
      </RegionProvider>
    </div>
  );
}

function DetectThenRedirect({ restPath, search, hash }) {
  const [to, setTo] = useState(null);
  useEffect(() => {
    (async () => {
      const region = await detectAndStorePreferredRegion();
      setTo(`/${region}${restPath}${search}${hash}`);
    })();
  }, [restPath, search, hash]);
  if (!to) return null;
  return <Navigate to={to} replace />;
}
