// src/components/ui/modal/CookieConsentBanner.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useGTM } from "../../../context/useGTM";
import RegionLink from "../../../router/RegionLink";

// Helpers de Consent Mode
function setDefaultConsent() {
  if (typeof window === "undefined") return;
  // Valor por defecto: denegado (evita cualquier tracking hasta aceptar)
  if (typeof window.gtag === "function") {
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      // Si quieres que los tags esperen unos ms al update, descomenta:
      // wait_for_update: 500
    });
  }
}

function updateConsentMode(decision) {
  if (typeof window === "undefined") return;

  const granted = decision === "accepted";
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      // Mantén ads en denied a menos que explícitamente los permitas
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  // Notifica a GTM para disparar tags dependientes (Hotjar)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: granted ? "consent_granted" : "consent_denied",
  });
}

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { updateConsent, trackEvent } = useGTM?.() || {
    updateConsent: () => {},
    trackEvent: () => {},
  };

  const ranDefaultRef = useRef(false);

  useEffect(() => {
    // 1) Fijar default DENIED sólo una vez por carga
    if (!ranDefaultRef.current) {
      setDefaultConsent();
      ranDefaultRef.current = true;
    }

    // 2) Leer decisión previa
    const stored = localStorage.getItem("filtr_cookie_consent");

    if (!stored) {
      // No hay decisión → mostrar banner y permanecer en denied
      setIsVisible(true);
      updateConsent("rejected");
      trackEvent("consent_banner_shown");
    } else {
      // Ya había decisión → sincronizar Consent Mode y GTM
      updateConsentMode(stored);
      updateConsent(stored);
    }
  }, [updateConsent, trackEvent]);

  const handleConsent = (decision) => {
    localStorage.setItem("filtr_cookie_consent", decision);

    // Actualizar Consent Mode + notificar a GTM (dispara Hotjar si accepted)
    updateConsentMode(decision);

    // Mantener tu tracking interno
    updateConsent(decision);
    trackEvent(
      decision === "accepted" ? "consent_accepted" : "consent_rejected"
    );

    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    trackEvent("consent_banner_closed");
    // Nota: cerrar sin decidir mantiene el estado por defecto (denied)
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUpFadeIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .slide-up { animation: slideUpFadeIn 0.5s ease-out; }
      `}</style>

      <div
        className={`
          fixed z-50 max-w-lg w-full bg-[#282828] border-1 border-white rounded-[16px]
          shadow-xl p-4 md:p-6 text-sm md:text-base bottom-4 left-1/2 md:left-4
          transform -translate-x-1/2 md:translate-x-0 slide-up
        `}
        role="dialog"
        aria-live="polite"
        aria-label="Aviso de cookies"
      >
        {/* Botón de cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Mensaje de beta */}
        <div className="mb-4">
          <h2 className="font-bold text-[#CFDD28] mb-1">
            ¡Estamos en versión Beta!
          </h2>
          <p className="text-white">
            Disfruta de Filtr mientras perfeccionamos la experiencia. Es posible
            que encuentres errores o comportamientos inesperados; estamos
            trabajando para mejorar.
          </p>
        </div>

        <hr className="my-3 border-gray-200" />

        {/* Mensaje de cookies */}
        <div className="text-white mb-4">
          <h2 className="font-bold text-[#CFDD28] mb-1">
            Seguimiento de cookies para ofrecerte la mejor experiencia en Filtr.
          </h2>
          <p>
            Este sitio utiliza cookies para fines analíticos y para mejorar la
            funcionalidad. Los datos pueden compartirse con terceros como
            Google. Para más detalles, consulta nuestro{" "}
            <RegionLink
              to="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white transition-colors"
            >
              Aviso de privacidad
            </RegionLink>
            .
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-2 md:justify-end">
          <button
            onClick={() => handleConsent("rejected")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            RECHAZAR
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="bg-[#ca249c] text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            ACEPTAR COOKIES
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieConsentBanner;
