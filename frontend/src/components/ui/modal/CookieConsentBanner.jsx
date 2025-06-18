import { useEffect, useState } from "react";

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem("filtr_cookie_consent");

    if (!storedConsent) {
      setIsVisible(true);
    } else {
      applyConsentToGtag(storedConsent);
    }
  }, []);

  const applyConsentToGtag = (decision) => {
    if (typeof window.gtag !== "function") return;

    if (decision === "accepted") {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        wait_for_update: 500,
      });
    } else {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        wait_for_update: 500,
      });
    }
  };

  const handleConsent = (decision) => {
    localStorage.setItem("filtr_cookie_consent", decision);
    applyConsentToGtag(decision);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUpFadeIn {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .slide-up {
          animation: slideUpFadeIn 0.5s ease-out;
        }
      `}</style>

      <div
        className={`
          fixed z-50 max-w-lg w-full bg-[#282828] border-1 border-white rounded-[16px] shadow-xl p-4 md:p-6 text-sm md:text-base 
          bottom-4 left-1/2 md:left-4 transform -translate-x-1/2 md:translate-x-0
          slide-up
        `}
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
            que encuentres errores o comportamientos inesperados; tu feedback
            nos ayuda a mejorar.
          </p>
        </div>

        <hr className="my-3 border-gray-200" />

        {/* Mensaje de cookies */}
        <div className="text-white mb-4">
          <h2 className="font-bold text-[#CFDD28] mb-1">
            Seguimiento de cookies para ofrecerte la mejor experiencia en Filtr.
          </h2>
          <p>
            Este sitio web utiliza cookies para recopilar información de tu
            dispositivo y navegador con fines de marketing y para mejorar la
            funcionalidad del sitio. Los datos podrán compartirse con terceros,
            como Google. Para más detalles, consulta nuestro{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white transition-colors"
            >
              Aviso de privacidad
            </a>
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
