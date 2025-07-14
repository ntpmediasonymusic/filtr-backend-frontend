/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect } from "react";
import TagManager from "react-gtm-module";
import { useLocation } from "react-router-dom";

export const GTMContext = createContext(null);

export const GTMProvider = ({ children, gtmId }) => {
  const location = useLocation();

  useEffect(() => {
    TagManager.initialize({ gtmId });
  }, [gtmId]);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "page_view",
        page_path: location.pathname,
      },
    });
  }, [location]);

  const trackEvent = (eventName, data = {}) => {
    TagManager.dataLayer({
      dataLayer: {
        event: eventName,
        ...data,
      },
    });
  };

  const updateConsent = (decision) => {
    const params = {
      ad_storage: decision === "accepted" ? "granted" : "denied",
      analytics_storage: decision === "accepted" ? "granted" : "denied",
      wait_for_update: 500,
    };

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", params);
    }

    TagManager.dataLayer({ dataLayer: { event: "consent_update", ...params } });
  };

  return (
    <GTMContext.Provider value={{ trackEvent, updateConsent }}>
      {children}
    </GTMContext.Provider>
  );
};

