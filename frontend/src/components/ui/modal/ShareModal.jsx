/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { MdLink, MdCheck } from "react-icons/md";

const ShareModal = ({
  link,
  title = "¡Mira esto!",
  imageBlob = null,
  onClose,
  playlistName,
  mainCategory,
  genre,
  moods = [],
}) => {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Construir el texto de compartir
  const buildShareText = (includeHashtags = true) => {
    const playlistUrl = link || window.location.href;
    const baseText = `🎧 Escucha esta playlist: ${
      playlistName || title
    } – ${playlistUrl} ¡Te va a encantar!`;

    if (!includeHashtags) return baseText;

    const hashtags = ["#Filtr"];
    if (mainCategory) hashtags.push(`#${mainCategory.replace(/\s+/g, "")}`);
    if (genre) hashtags.push(`#${genre.replace(/\s+/g, "")}`);
    moods.forEach((m) => m && hashtags.push(`#${m.replace(/\s+/g, "")}`));

    return `${baseText}\n\n${hashtags.join(" ")}`;
  };

  const handleCopy = async () => {
    try {
      const textToCopy = buildShareText(true);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setShowCopyMessage(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowCopyMessage(false), 3000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const shareWithWebAPI = async (shareData) => {
    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        onClose();
        return true;
      } catch (err) {
        console.warn("Cancelado o error en Web Share API", err);
      }
    }
    return false;
  };

  const handleShare = async (platform) => {
    // Construir el texto completo con hashtags
    const fullShareText = buildShareText(true);
    const urlToShare = link || window.location.href;

    // 1) Si hay imagen y navegador soporta compartir ficheros
    if (imageBlob) {
      const file = new File([imageBlob], "share.png", { type: imageBlob.type });
      if (
        await shareWithWebAPI({
          files: [file],
          text: fullShareText,
          url: urlToShare,
          title: playlistName || title,
        })
      ) {
        return;
      }
    }

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          urlToShare
        )}&quote=${encodeURIComponent(fullShareText)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          fullShareText
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          fullShareText
        )}`;
        break;
      case "instagram":
        // Intentamos Web Share API para solo texto
        handleCopy();
        if (await shareWithWebAPI({ text: fullShareText })) {
          return;
        }
        // Fallback: copiar enlace + texto
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" />

      {/* Modal centered */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          ref={ref}
          className="flex flex-col gap-6 w-full max-w-[500px] bg-[#282828] p-8 rounded-[16px] shadow-2xl relative"
        >
          {/* Mensaje de copiado */}
          {showCopyMessage && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
              ¡Enlace copiado en el portapapeles!
            </div>
          )}

          {/* Título */}
          <h3 className="text-white text-xl font-bold text-center">
            Compartir Playlist
          </h3>

          {/* Botón Copiar Link */}
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-3 rounded-[8px] w-full p-4 font-semibold cursor-pointer transition-all duration-200 ${
              copied
                ? "bg-green-500 text-white"
                : "bg-[#B9F2CD] text-black hover:bg-[#a8e3bc]"
            }`}
          >
            {copied ? (
              <>
                <MdCheck className="w-6 h-6" />
                ¡COPIADO!
              </>
            ) : (
              <>
                <MdLink className="w-6 h-6" />
                COPIAR LINK
              </>
            )}
          </button>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#282828] text-white/70">
                o comparte en
              </span>
            </div>
          </div>

          {/* Botones de redes */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleShare("facebook")}
              className="flex-1 flex items-center justify-center py-4 bg-[#B9F2CD] rounded-[8px] hover:bg-[#a8e3bc] transition-all group"
              title="Compartir en Facebook"
            >
              <FaFacebook className="w-7 h-7 text-black group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex-1 flex items-center justify-center py-4 bg-[#B9F2CD] rounded-[8px] hover:bg-[#a8e3bc] transition-all group"
              title="Compartir en WhatsApp"
            >
              <FaWhatsapp className="w-7 h-7 text-black group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="flex-1 flex items-center justify-center py-4 bg-[#B9F2CD] rounded-[8px] hover:bg-[#a8e3bc] transition-all group"
              title="Compartir en Instagram o copiar enlace"
            >
              <FaInstagram className="w-7 h-7 text-black group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="flex-1 flex items-center justify-center py-4 bg-[#B9F2CD] rounded-[8px] hover:bg-[#a8e3bc] transition-all group"
              title="Compartir en X (Twitter)"
            >
              <FaXTwitter className="w-7 h-7 text-black group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Cerrar */}
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
        </div>
      </div>
    </>
  );
};

export default ShareModal;
