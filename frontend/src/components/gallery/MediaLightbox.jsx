/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoDownloadOutline,
  IoImageOutline,
} from "react-icons/io5";
import { formatEventDate } from "../../utils/gallery";
import ShareMenu from "./ShareMenu";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function buildDownloadName(event, item) {
  const extMatch = /\.[a-zA-Z0-9]+$/.exec(item.source || "");
  const ext = extMatch ? extMatch[0] : "";
  const base = `${event.slug || "filtr"}-${item.id || "media"}`;
  return `${base}${ext}`;
}

export default function MediaLightbox({
  items,
  index,
  onClose,
  onIndexChange,
  event,
  shareUrl,
  onShare,
  onDownload,
}) {
  const containerRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const isVideoPlayingRef = useRef(false);
  const touchStartXRef = useRef(null);
  const [mediaFailed, setMediaFailed] = useState(false);

  const item = items[index];

  const goTo = (nextIndex) => {
    if (!items.length) return;
    const wrapped = (nextIndex + items.length) % items.length;
    onIndexChange(wrapped);
  };

  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);

  // Reinicia el estado de error al cambiar de pieza.
  useEffect(() => {
    setMediaFailed(false);
    isVideoPlayingRef.current = false;
  }, [item?.id]);

  // Precarga solo la pieza anterior y siguiente (no toda la galeria) para
  // que "Anterior"/"Siguiente" se sientan instantaneos sin descargar de mas.
  useEffect(() => {
    if (items.length < 2) return;
    [index - 1, index + 1].forEach((i) => {
      const neighbor = items[(i + items.length) % items.length];
      if (neighbor?.type === "image" && neighbor.source) {
        const preload = new Image();
        preload.src = neighbor.source;
      }
    });
  }, [index, items]);

  // Foco inicial, retorno de foco y focus trap.
  useEffect(() => {
    lastFocusedRef.current = document.activeElement;
    const container = containerRef.current;
    const focusable = container?.querySelector(FOCUSABLE_SELECTOR);
    focusable?.focus();

    return () => {
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus();
      }
    };
  }, []);

  // Bloqueo de scroll de fondo mientras el lightbox esta abierto.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Teclado: flechas, Escape, focus trap con Tab.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (isVideoPlayingRef.current) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Tab") {
        const container = containerRef.current;
        if (!container) return;
        const focusables = Array.from(
          container.querySelectorAll(FOCUSABLE_SELECTOR),
        ).filter((el) => !el.disabled);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  // Cierra solo si el mousedown fue literalmente sobre el backdrop.
  // No usamos containerRef.contains(e.target): ShareMenu porta su panel a
  // document.body, y React sigue burbujeando el evento sintetico por el
  // arbol de React (no el DOM real) a traves del portal. Eso hacia que
  // containerRef.contains() diera "false" para clics dentro del menu de
  // compartir y cerrara todo el lightbox antes de ejecutar la accion.
  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current == null || isVideoPlayingRef.current) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  if (!item) return null;

  const locationLabel = [event.city, event.country].filter(Boolean).join(", ");
  const dateLabel = formatEventDate(event.date);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-0 sm:p-6"
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      aria-label={item.title || item.alt || "Visor de galería"}
    >
      <div
        ref={containerRef}
        className="relative flex flex-col w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[16px] bg-[#131517] overflow-hidden"
      >
        {/* Toolbar superior */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <span className="text-white/70 text-xs sm:text-sm truncate">
            {event.title}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {item.downloadable && (
              <a
                href={item.source}
                download={buildDownloadName(event, item)}
                onClick={() => onDownload?.(item)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
                aria-label="Descargar"
              >
                <IoDownloadOutline />
                <span className="hidden sm:inline">Descargar</span>
              </a>
            )}
            {item.shareable && (
              <ShareMenu
                url={shareUrl}
                title={item.title || event.title}
                onShare={onShare}
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Cerrar"
            >
              <IoClose size={22} />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div
          className="relative flex-1 flex items-center justify-center bg-black min-h-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {items.length > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 sm:left-4 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
              aria-label="Anterior"
            >
              <IoChevronBack size={22} />
            </button>
          )}

          {mediaFailed ? (
            <div className="flex flex-col items-center gap-2 text-white/50 p-10">
              <IoImageOutline size={40} />
              <span className="text-sm">No se pudo cargar este contenido.</span>
            </div>
          ) : item.type === "video" ? (
            <video
              key={item.id}
              src={item.source}
              poster={item.thumbnail}
              controls
              onError={() => setMediaFailed(true)}
              onPlay={() => (isVideoPlayingRef.current = true)}
              onPause={() => (isVideoPlayingRef.current = false)}
              onEnded={() => (isVideoPlayingRef.current = false)}
              className="max-h-[70vh] sm:max-h-[65vh] max-w-full"
            />
          ) : (
            <img
              key={item.id}
              src={item.source}
              alt={item.alt || item.title || ""}
              width={item.width}
              height={item.height}
              decoding="async"
              onError={() => setMediaFailed(true)}
              className="max-h-[70vh] sm:max-h-[65vh] max-w-full object-contain"
            />
          )}

          {items.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 sm:right-4 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
              aria-label="Siguiente"
            >
              <IoChevronForward size={22} />
            </button>
          )}
        </div>

        {/* Info inferior */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-t border-white/10">
          <div className="flex flex-col gap-0.5 min-w-0">
            {item.title && (
              <span className="text-white text-sm font-semibold truncate">
                {item.title}
              </span>
            )}
            {item.caption && (
              <span className="text-white/70 text-xs truncate">{item.caption}</span>
            )}
            <span className="text-white/50 text-xs truncate">
              {[locationLabel, dateLabel].filter(Boolean).join(" · ")}
              {item.credit ? ` · Foto: ${item.credit}` : ""}
            </span>
          </div>

          {items.length > 1 && (
            <span className="text-[#00DAF0] text-sm font-semibold shrink-0">
              {String(index + 1).padStart(2, "0")} / {items.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
