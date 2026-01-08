/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FAVORITES_MODAL_KEY = "spotifyFavoritePlaylistsModalShown";

const SpotifyFavoritePlaylistsModal = ({
  isSpotifyConnected,
  onClose,
  onConfirm,
}) => {
  const ref = useRef(null);

  // Marcar como "ya mostrado" en localStorage
  const markAsShown = () => {
    try {
      localStorage.setItem(FAVORITES_MODAL_KEY, "true");
    } catch {
      // ignorar errores de localStorage
    }
  };

  // Cerrar al hacer click fuera del modal
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        markAsShown();
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose]);

  // Evitar que el PageHeader capture el mousedown dentro del modal
  useEffect(() => {
    const stopIfInside = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        e.stopPropagation();
      }
    };
    document.addEventListener("mousedown", stopIfInside, true); // capture = true
    return () => document.removeEventListener("mousedown", stopIfInside, true);
  }, []);

  if (typeof document === "undefined") return null;

  const isCurrentlyConnected = isSpotifyConnected;

  const handleCloseOnly = () => {
    markAsShown();
    onClose();
  };

  const handleConnectClick = () => {
    markAsShown();
    onConfirm(); // aquí se llama a startSpotifyConnect en el padre
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[9998] transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div
          ref={ref}
          className="relative bg-[#282828] p-8 rounded-[16px] shadow-2xl w-full max-w-[550px] flex flex-col gap-4"
        >
          {/* Close */}
          <button
            onClick={handleCloseOnly}
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
              ? "Tus playlists favoritas también irán a Spotify"
              : "Conecta tu cuenta con Spotify"}
          </h3>

          {/* Texto principal */}
          <p className="text-white/80 text-center">
            {isCurrentlyConnected
              ? "Ya estás conectado a Spotify. A partir de ahora, las playlists que marques como favoritas en Filtr también se guardarán en tu biblioteca de Spotify."
              : "Las playlists que marques como favoritas en Filtr se guarden automáticamente en tu biblioteca de Spotify."}
          </p>

          {/* Texto secundario */}
          <p className="text-white/60 text-center text-sm">
            {isCurrentlyConnected
              ? "Si en algún momento quieres dejar de sincronizar tus playlists, puedes desconectar tu cuenta de Spotify desde el menú de tu perfil."
              : "Para continuar, te redirigiremos a Spotify para que inicies sesión y autorices la conexión."}
          </p>

          {/* Footer: botones */}
          <div className="flex justify-end gap-2 pt-4">
            {isCurrentlyConnected ? (
              // Solo botón ACEPTAR (informativo)
              <button
                onClick={handleCloseOnly}
                className="px-4 py-2 bg-[#B9F2CD] font-semibold rounded hover:opacity-90 transition cursor-pointer"
              >
                ACEPTAR
              </button>
            ) : (
              <>
                <button
                  onClick={handleCloseOnly}
                  className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleConnectClick}
                  className="px-4 py-2 bg-[#B9F2CD] font-semibold rounded hover:opacity-90 transition cursor-pointer"
                >
                  CONECTAR
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default SpotifyFavoritePlaylistsModal;
