/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const ExternalLinkModal = ({ url, onClose, onConfirm }) => {
  const ref = useRef(null);
  const [dontShowAgain, setDontShowAgain] = useState(
    () => localStorage.getItem("externalLinkDontShow") === "true"
  );

  // Extraer dominio
  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose]);

  const handleCheckbox = () => {
    const next = !dontShowAgain;
    setDontShowAgain(next);
    localStorage.setItem("externalLinkDontShow", next);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          ref={ref}
          className="relative bg-[#282828] p-8 rounded-[16px] shadow-2xl w-full max-w-[550px] flex flex-col gap-4"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
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

          {/* Título */}
          <h3 className="text-white text-xl font-bold text-center">
            Estás a punto de salir de Filtr
          </h3>

          {/* Texto */}
          <p className="text-white/80 text-center">
            Te diriges a un sitio externo no afiliado a Filtr.
          </p>

          {/* Dominio */}
          <div className="border border-white/30 rounded p-1 text-white text-center break-all">
            {domain}
          </div>

          {/* Explicación */}
          <p className="text-white/80 text-center">
            Allí encontrarás más información sobre este show y podrás adquirir
            tu entrada.
          </p>

          {/* Footer: checkbox + botones */}
          <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-4 pt-4">
            <label className="flex items-center gap-2 text-white/80 text-sm">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={handleCheckbox}
                className="w-4 h-4 accent-[#B9F2CD]"
              />
              No volver a mostrar
            </label>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition"
              >
                CANCELAR
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-[#B9F2CD] font-semibold rounded hover:opacity-90 transition"
              >
                CONTINUAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExternalLinkModal;
