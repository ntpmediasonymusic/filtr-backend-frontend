/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaFacebook, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { MdLink, MdCheck } from "react-icons/md";
import SharePaperPlaneIcon from "../../assets/icons/SharePaperPlaneIcon";
import MerchDropdown from "../merch/MerchDropdown";

// Menu compacto de compartir para el lightbox. Reutiliza MerchDropdown
// (mismo mecanismo de popover: click afuera + Escape) y las mismas tecnicas
// de ShareModal (URLs por plataforma, copiar con confirmacion), pero en un
// menu anclado en vez de un modal centrado, para no competir visualmente
// con la imagen ampliada del lightbox.
export default function ShareMenu({ url, title, onShare }) {
  return (
    <MerchDropdown
      label="Compartir"
      usePortal
      panelClassName="min-w-[240px]"
      // El lightbox de la galeria usa z-[100]; el panel portado debe quedar
      // por encima de ese overlay, no solo escapar su overflow-hidden.
      panelZIndexClassName="z-[110]"
      renderLabel={() => (
        <span className="flex items-center gap-2">
          <SharePaperPlaneIcon className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Compartir</span>
        </span>
      )}
    >
      {({ close }) => (
        <ShareMenuContent url={url} title={title} onShare={onShare} close={close} />
      )}
    </MerchDropdown>
  );
}

function ShareMenuContent({ url, title, onShare, close }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShare?.("copy_link");
      setTimeout(() => {
        setCopied(false);
        close();
      }, 1200);
    } catch {
      // Si el portapapeles falla (permiso, navegador viejo), no rompe la UI.
    }
  };

  const openExternal = (platform, shareUrl) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    onShare?.(platform);
    close();
  };

  const itemClass =
    "w-full flex items-center gap-3 text-left text-base px-3 py-2.5 rounded-lg text-white hover:bg-white/10 transition cursor-pointer";
  const iconClass = "w-6 h-6 shrink-0";

  return (
    <ul className="flex flex-col gap-1 min-w-[220px]">
      <li>
        {/* Copia la URL compartible de la pieza al portapapeles. */}
        <button type="button" onClick={handleCopy} className={itemClass}>
          {copied ? (
            <MdCheck className={`${iconClass} text-[#19A74E]`} />
          ) : (
            <MdLink className={iconClass} />
          )}
          {copied ? "¡Enlace copiado!" : "Copiar enlace"}
        </button>
      </li>
      <li>
        {/* Abre WhatsApp con el texto y el enlace ya cargados para publicar. */}
        <button
          type="button"
          onClick={() =>
            openExternal(
              "whatsapp",
              `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
            )
          }
          className={itemClass}
        >
          <FaWhatsapp className={`${iconClass} text-[#25D366]`} />
          WhatsApp
        </button>
      </li>
      <li>
        {/* Abre el dialogo de Facebook para publicar el enlace. */}
        <button
          type="button"
          onClick={() =>
            openExternal(
              "facebook",
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            )
          }
          className={itemClass}
        >
          <FaFacebook className={`${iconClass} text-[#1877F2]`} />
          Facebook
        </button>
      </li>
      <li>
        {/* Abre el compositor de X con el texto y el enlace ya cargados. */}
        <button
          type="button"
          onClick={() =>
            openExternal(
              "x",
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            )
          }
          className={itemClass}
        >
          <FaXTwitter className={iconClass} />X
        </button>
      </li>
    </ul>
  );
}
