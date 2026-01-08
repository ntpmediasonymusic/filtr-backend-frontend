/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import UserCircleIcon from "../../../assets/icons/UserCircleIcon";
import { FaHeart, FaSignOutAlt, FaSpotify } from "react-icons/fa";
import RegionNavLink from "../../../router/RegionNavLink";
import SpotifyConnectModal from "./SpotifyConnectModal";
import {
  startSpotifyConnect,
  disconnectSpotify,
  getUserById,
} from "../../../api/backendApi";

// Helper para saber si un user tiene Spotify conectado
const isUserSpotifyConnected = (user) => {
  if (!user) return false;

  const {
    spotifyId,
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyTokenExpiresAt,
  } = user;

  if (
    !spotifyId ||
    !spotifyAccessToken ||
    !spotifyRefreshToken ||
    !spotifyTokenExpiresAt
  ) {
    return false;
  }

  const expiresAt = new Date(spotifyTokenExpiresAt);
  if (Number.isNaN(expiresAt.getTime())) return false;

  return expiresAt > new Date();
};

const ProfileModal = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);

  // Usuario desde localStorage, guardado en estado
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  // Estado local del toggle, inicializado desde el usuario
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(() =>
    isUserSpotifyConnected(user)
  );

  // Recalcular el toggle cuando el user cambie
  useEffect(() => {
    setIsSpotifyConnected(isUserSpotifyConnected(user));
  }, [user]);

  // Al volver de Spotify con ?spotifyConnected=1, refrescar el usuario desde backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("spotifyConnected");

    if (flag === "1" && user && user.id) {
      (async () => {
        try {
          const resp = await getUserById(user.id);
          const updatedUser = resp.data;

          // Sincronizar localStorage + estado
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (err) {
          console.error(
            "Error actualizando usuario tras conectar Spotify:",
            err
          );
        } finally {
          // Limpiar el query param para no repetir este flujo
          params.delete("spotifyConnected");
          const newSearch = params.toString();
          const newUrl =
            window.location.pathname + (newSearch ? `?${newSearch}` : "");
          window.history.replaceState({}, "", newUrl);
        }
      })();
    }
  }, [user.id]); // user siempre es un objeto, así que user.id será undefined o un string

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onClose();
    window.location.reload();
  };

  const handleSpotifyConnectToggle = () => {
    if (localStorage.getItem("spotifyConnectDontShow") !== "true") {
      setShowModal(true);
    } else {
      confirmConnection();
    }
  };

  const confirmConnection = async () => {
    setShowModal(false);

    if (!user || !user.id) {
      console.error(
        "No hay usuario válido en localStorage para conectar Spotify"
      );
      return;
    }

    try {
      if (isSpotifyConnected) {
        // ---- DESCONEXIÓN ----
        const resp = await disconnectSpotify(user.id);
        const updated = resp.data?.user || resp.data;

        if (updated) {
          localStorage.setItem("user", JSON.stringify(updated));
          setUser(updated); // sincronizar estado
        }

        setIsSpotifyConnected(false);
      } else {
        // ---- CONEXIÓN ----
        const currentPath = window.location.pathname + window.location.search;
        const resp = await startSpotifyConnect(user.id, currentPath);
        const url = resp.data?.url;

        if (url) {
          // Redirigimos al flujo OAuth de Spotify
          window.location.href = url;
        } else {
          console.error(
            "Respuesta inesperada de /spotify/connect/start:",
            resp.data
          );
        }
      }
    } catch (err) {
      console.error(
        isSpotifyConnected
          ? "Error al desconectar Spotify"
          : "Error al iniciar conexión con Spotify",
        err
      );
    }
  };

  return (
    <>
      <div className="absolute -right-6 mt-2 flex flex-col w-auto bg-[#282828] p-4 rounded-[12px] text-white z-20">
        {/* Perfil info */}
        <div className="flex flex-row gap-4 mb-4">
          <div>
            <UserCircleIcon className="w-10 h-10 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{user.firstName}</span>
            <span className="text-sm text-gray-400">{user.email}</span>
            <RegionNavLink
              to="/edit-account"
              onClick={onClose}
              className="text-[#00DAF0] hover:underline text-sm"
            >
              Editar perfil
            </RegionNavLink>
          </div>
        </div>

        <hr className="border-gray-700 mb-4" />

        {/* Spotify Connect */}
        <button
          type="button"
          onClick={handleSpotifyConnectToggle}
          className="flex flex-row items-center justify-between gap-4 py-2 pl-2 pr-3 hover:bg-white/10 rounded text-left cursor-pointer"
        >
          <div className="flex flex-row items-center gap-3">
            <FaSpotify />
            <span>Conectar Spotify</span>
          </div>

          {/* Toggle visual (no clickable independiente, todo el botón lo es) */}
          <div
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              isSpotifyConnected ? "bg-[#25D666]" : "bg-gray-500"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                isSpotifyConnected ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        {/* Mis Playlist favoritas */}
        <RegionNavLink
          to="/favorite-playlists"
          onClick={onClose}
          className="flex flex-row items-center gap-4 py-2 pl-2 hover:bg-white/10 rounded"
        >
          <FaHeart />
          <span>Mis Playlist favoritas</span>
        </RegionNavLink>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-row items-center gap-4 py-2 pl-2 hover:bg-white/10 rounded text-left cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Spotify Connect Modal */}
      {showModal && (
        <SpotifyConnectModal
          isSpotifyConnected={isSpotifyConnected}
          onClose={() => setShowModal(false)}
          onConfirm={confirmConnection}
        />
      )}
    </>
  );
};

export default ProfileModal;
