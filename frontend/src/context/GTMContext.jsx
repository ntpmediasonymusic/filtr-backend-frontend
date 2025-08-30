/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useRef, useCallback } from "react";
import TagManager from "react-gtm-module";
import { useLocation } from "react-router-dom";
import { useRegion } from "../router/RegionContext";

export const GTMContext = createContext(null);

export const GTMProvider = ({ children, gtmId }) => {
  const location = useLocation();
  const { region } = useRegion();
  const initializedRef = useRef(false);

  // Helper consistente para pushear al dataLayer
  const pushDL = useCallback((data) => {
    try {
      TagManager.dataLayer({ dataLayer: data });
    } catch {
      // fallback por si algo falla con react-gtm-module
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(data);
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    TagManager.initialize({ gtmId });
    initializedRef.current = true;
    pushDL({
      event: "gtm_init",
      region,
    });
  }, [gtmId, pushDL, region]);
  useEffect(() => {
    if (!initializedRef.current) return;
    pushDL({
      event: "region_set",
      region,
    });
  }, [region, pushDL]);

  useEffect(() => {
    if (!initializedRef.current) return;
    const page_path = location.pathname + location.search;
    const page_title =
      typeof document !== "undefined" ? document.title : undefined;

    pushDL({
      event: "page_view",
      page_path,
      page_title,
      region,
    });
  }, [location, region, pushDL]);

  const trackEvent = useCallback(
    (eventName, data = {}) => {
      pushDL({
        event: eventName,
        region,
        ...data,
      });
    },
    [pushDL, region]
  );

  const updateConsent = useCallback(
    (decision) => {
      const params = {
        ad_storage: decision === "accepted" ? "granted" : "denied",
        analytics_storage: decision === "accepted" ? "granted" : "denied",
        wait_for_update: 500,
      };

      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", params);
      }

      pushDL({
        event: "consent_update",
        region,
        ...params,
      });
    },
    [pushDL, region]
  );

  return (
    <GTMContext.Provider value={{ trackEvent, updateConsent }}>
      {children}
    </GTMContext.Provider>
  );
};
