/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PlaylistPlayButton from "../../assets/icons/PlaylistPlayButton";
import ShareModal from "./modal/ShareModal";
import SharePaperPlaneIcon from "../../assets/icons/SharePaperPlaneIcon";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addFavoritePlaylist,
  removeFavoritePlaylist,
  getUserById,
  startSpotifyConnect,
  followSpotifyPlaylist,
  unfollowSpotifyPlaylist
} from "../../api/backendApi";
import { usePlaylists } from "../../context/PlaylistContext";
import LoginModal from "./modal/LoginModal";
import ClipLoader from "react-spinners/ClipLoader";
import SpotifyFavoritePlaylistsModal from "./modal/SpotifyFavoritePlaylistsModal";

// Clave para el flag de "ya mostré este modal"
const FAVORITES_MODAL_KEY = "spotifyFavoritePlaylistsModalShown";

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

export default function PlaylistCard({
  playlistName,
  urlPlaylist,
  urlCoverImage,
  isFavorite,
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [favorited, setFavorited] = useState(!!isFavorite);
  const { refreshPlaylists } = usePlaylists();
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [isSpotifyConnected, setIsSpotifyConnected] = useState(() =>
    isUserSpotifyConnected(user)
  );

  const bearer = localStorage.getItem("token");
  const loggedIn = !!bearer && !!user?.id;
  const playlistId = urlPlaylist.split("/playlist/")[1].split("?")[0];

  // Recalcular conexión a Spotify cuando cambia el usuario
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
  }, [user.id]);

  const handleToggleFavorite = async () => {
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    // Tokens de Spotify del usuario (si está conectado)
    const spotifyTokens = {
      spotifyId: user.spotifyId,
      spotifyAccessToken: user.spotifyAccessToken,
      spotifyRefreshToken: user.spotifyRefreshToken,
      spotifyTokenExpiresAt: user.spotifyTokenExpiresAt,
    };
    try {
      if (!favorited) {
        // 1) Guardar en MySQL
        await addFavoritePlaylist(user.id, playlistId);

        // 2) Si está conectado a Spotify, seguir la playlist en Spotify
        if (isSpotifyConnected) {
          try {
            await followSpotifyPlaylist(user.id, playlistId, spotifyTokens);
          } catch (spotifyErr) {
            console.error(
              "Error al seguir la playlist en Spotify:",
              spotifyErr
            );
          }
        }
      } else {
        // 1) Quitar de favoritos en MySQL
        await removeFavoritePlaylist(user.id, playlistId);

        // 2) Si está conectado a Spotify, dejar de seguir la playlist
        if (isSpotifyConnected) {
          try {
            await unfollowSpotifyPlaylist(user.id, playlistId, spotifyTokens);
          } catch (spotifyErr) {
            console.error(
              "Error al dejar de seguir la playlist en Spotify:",
              spotifyErr
            );
          }
        }
      }

      // Refrescar listas locales
      await refreshPlaylists();
      setFavorited(!favorited);
    } catch (err) {
      console.error("Error al actualizar favoritos (MySQL):", err);
    } finally {
      setIsLoading(false);

      // Si ACABAMOS de marcarla como favorita, mostrar modal informativo/conexión
      if (!favorited) {
        handleSpotifyFavoriteModal();
      }
    }
  };

  // Mostrar el modal informativo / de conexión solo si no se ha mostrado antes
  const handleSpotifyFavoriteModal = () => {
    if (localStorage.getItem(FAVORITES_MODAL_KEY) !== "true") {
      setShowSpotifyModal(true);
    }
  };

  // Confirmar conexión a Spotify (solo se usa cuando NO está conectado)
  const confirmConnection = async () => {
    setShowSpotifyModal(false);

    if (!user || !user.id) {
      console.error(
        "No hay usuario válido en localStorage para conectar Spotify"
      );
      return;
    }

    try {
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
    } catch (err) {
      console.error("Error al iniciar conexión con Spotify", err);
    }
  };

  return (
    <div
      className="flex flex-col flex-shrink-0
                    w-40 sm:w-48 md:w-56 lg:w-64
                    bg-[#282534] rounded-lg p-3 gap-2.5"
    >
      <a
        href={urlPlaylist}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <PlaylistCardImage src={urlCoverImage} alt={playlistName} />
        <div
          className="absolute inset-0 bg-black/50 rounded-lg 
                        opacity-0 group-hover:opacity-100 
                        flex items-center justify-center
                        transition-opacity"
        >
          <div className="w-1/2 h-1/2">
            <PlaylistPlayButton onlyArrow className="w-full h-full" />
          </div>
        </div>
      </a>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
        <h6 className="flex-1 text-white text-left line-clamp-2 min-h-[3rem]">
          {playlistName}
        </h6>

        <div className="flex items-center gap-3 md:gap-2 w-full md:w-auto justify-end">
          <button onClick={handleToggleFavorite} className="flex-shrink-0">
            {isLoading ? (
              <ClipLoader size={18} color="#FFFFFF" />
            ) : loggedIn && favorited ? (
              <FaHeart className="w-6 h-6 text-red-500 scale-110 transition-transform" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-white hover:scale-110 transition-transform" />
            )}
          </button>
          <button
            onClick={() => setShowShareModal((v) => !v)}
            className="flex-shrink-0"
          >
            <SharePaperPlaneIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          link={urlPlaylist}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          message="Para guardar tus playlist favoritas primero debes iniciar sesión"
        />
      )}

      {/* Spotify Favorite Playlists Modal */}
      {showSpotifyModal && (
        <SpotifyFavoritePlaylistsModal
          isSpotifyConnected={isSpotifyConnected}
          onClose={() => setShowSpotifyModal(false)}
          onConfirm={confirmConnection}
        />
      )}
    </div>
  );
}

function PlaylistCardImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="relative w-full before:block before:pt-[100%]
                    rounded-lg overflow-hidden bg-gray-700"
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
