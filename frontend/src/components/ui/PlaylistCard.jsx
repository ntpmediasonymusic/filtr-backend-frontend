import { useState } from "react";
import PlaylistPlayButton from "../../assets/icons/PlaylistPlayButton";
import ShareModal from "./modal/ShareModal";
import SharePaperPlaneIcon from "../../assets/icons/SharePaperPlaneIcon";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addFavoritePlaylist,
  removeFavoritePlaylist,
} from "../../api/backendApi";
import { usePlaylists } from "../../context/PlaylistContext";
import LoginModal from "./modal/LoginModal";
import ClipLoader from "react-spinners/ClipLoader";

/* eslint-disable react/prop-types */
const PlaylistCard = ({
  playlistName,
  urlPlaylist,
  urlCoverImage,
  isFavorite,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [favorited, setFavorited] = useState(!!isFavorite);
  const { refreshPlaylists } = usePlaylists();
  const [isLoading, setIsLoading] = useState(false);

  // Datos del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const bearer = localStorage.getItem("token");
  const loggedIn = !!bearer && !!user?.id;

  // Extraer ID de Spotify de la URL
  const playlistId = urlPlaylist.split("/playlist/")[1].split("?")[0];

  const handleToggleFavorite = async () => {
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsLoading(true);
    try {
      if (!favorited) {
        await addFavoritePlaylist(user.id, playlistId);
      } else {
        await removeFavoritePlaylist(user.id, playlistId);
      }
      await refreshPlaylists();
      setFavorited(!favorited);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col w-full max-w-40 md:max-w-60 sm:max-w-50 flex-shrink-0 bg-[#282534] rounded-lg p-3 gap-2.5">
      <a
        href={urlPlaylist}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
      >
        <img
          src={urlCoverImage}
          alt={playlistName}
          className="w-full h-auto rounded-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-1/2 h-1/2">
            <PlaylistPlayButton onlyArrow className="w-full h-full" />
          </div>
        </div>
      </a>

      <div className="flex w-full flex-col md:flex-row justify-between items-center gap-2.5">
        <h6 className="flex-1 text-white text-left line-clamp-2 min-h-[3rem]">
          {playlistName}
        </h6>

        <div className="flex items-center gap-3 md:gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleToggleFavorite}
            className="flex-shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <ClipLoader size={18} color="#FFFFFF" />
            ) : loggedIn && favorited ? (
              <FaHeart className="w-6 h-6 text-red-500 transform scale-110 transition-transform duration-200" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-white transition-transform duration-200 hover:scale-110" />
            )}
          </button>
          <button
            onClick={() => setShowShareModal((v) => !v)}
            className="flex-shrink-0 cursor-pointer"
          >
            {loggedIn ? (
              <SharePaperPlaneIcon className="w-6 h-6 text-white" />
            ) : (
              <SharePaperPlaneIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          link={urlPlaylist}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default PlaylistCard;
