/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SpotifyConnectModal = ({ isSpotifyConnected, onClose, onConfirm }) => {
  const ref = useRef(null);
  const [dontShowAgain, setDontShowAgain] = useState(
    () => localStorage.getItem("spotifyConnectDontShow") === "true"
  );

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
    localStorage.setItem("spotifyConnectDontShow", next);
  };

  const isCurrentlyConnected = isSpotifyConnected;

  // En entornos sin DOM (SSR) simplemente no renderizamos nada
  if (typeof document === "undefined") return null;

  const modalContent = (
    <>
      {/* Backdrop: ocupa SIEMPRE todo el viewport */}
      <div className="fixed inset-0 bg-black/60 z-[9998] transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div
          ref={ref}
          className="relative bg-[#282828] p-8 rounded-[16px] shadow-2xl w-full max-w-[550px] flex flex-col gap-4"
        >
          {/* Close */}
          <button
            onClick={onClose}
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

          {/* Título */}
          <h3 className="text-white text-xl font-bold text-center">
            {isCurrentlyConnected
              ? "Desconectar tu cuenta de Spotify"
              : "Conecta tu cuenta con Spotify"}
          </h3>

          {/* Texto principal */}
          <p className="text-white/80 text-center">
            {isCurrentlyConnected
              ? "Al desconectar tu cuenta de Spotify, ya no podremos usar tu perfil para guardar playlists en tu biblioteca ni ofrecerte recomendaciones personalizadas."
              : "Al vincular tu cuenta podrás guardar playlists en tu biblioteca, mejorar tus recomendaciones y acceder a funciones exclusivas basadas en tu forma de escuchar música."}
          </p>

          {/* Texto secundario */}
          <p className="text-white/60 text-center text-sm">
            {isCurrentlyConnected
              ? "Podrás volver a conectar tu cuenta cuando quieras desde este mismo menú."
              : "Para continuar, te redirigiremos a Spotify para que inicies sesión y autorices la conexión."}
          </p>

          {/* Footer: checkbox + botones */}
          <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-4 pt-4">
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
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
                className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-[#B9F2CD] font-semibold rounded hover:opacity-90 transition cursor-pointer"
              >
                {isCurrentlyConnected ? "DESCONECTAR" : "CONECTAR"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Renderizamos el modal directamente en <body>, fuera del header
  return createPortal(modalContent, document.body);
};

export default SpotifyConnectModal;
