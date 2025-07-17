/* eslint-disable react/prop-types */
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

export default function PlaylistCard({
  playlistName,
  urlPlaylist,
  urlCoverImage,
  isFavorite,
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [favorited, setFavorited] = useState(!!isFavorite);
  const { refreshPlaylists } = usePlaylists();
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const bearer = localStorage.getItem("token");
  const loggedIn = !!bearer && !!user?.id;
  const playlistId = urlPlaylist.split("/playlist/")[1].split("?")[0];

  const handleToggleFavorite = async () => {
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsLoading(true);
    try {
      if (!favorited) await addFavoritePlaylist(user.id, playlistId);
      else await removeFavoritePlaylist(user.id, playlistId);
      await refreshPlaylists();
      setFavorited(!favorited);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
