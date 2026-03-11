/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import MapMarker from "../../assets/icons/MapMarker";
import { IoTicketOutline } from "react-icons/io5";
import useFormattedDate from "../../hooks/shows/useFormattedDate";
// Dejar import por si lo reactivas después:
import ExternalLinkModal from "../ui/modal/ExternalLinkModal";
import LoginModal from "../ui/modal/LoginModal";

import {
  isLivestream,
  buildFollowUrl,
  buildNotifyUrl,
  buildRsvpUrl,
  buildPlayMyCityUrl,
  buildWaitlistUrl,
} from "../../api/bandsintown";

const ENABLE_EXTERNAL_LINK_MODAL = false; // ⬅️ Cambia a true si lo quieres reactivar

const ShowCard = ({
  artist = "",
  showName = "",
  urlShow = "",
  date = "",
  place = { location: "", venue: "" },
  canceled = false,

  bitEvent = null,
  artistName = "",
  artistBitUrl = "",
  artistApiId = "",

  // NUEVO: imágenes del artista (desde /artists/:name)
  artistImageUrl = "",
  artistThumbUrl = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(urlShow);

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const bearer = localStorage.getItem("token");
      setLoggedIn(!!bearer && !!user?.id);
    } catch {
      setLoggedIn(false);
    }
  }, []);

  const derived = useMemo(() => {
    const baseArtist = artistName || artist;

    if (!bitEvent) {
      return {
        _artist: baseArtist,
        _date: date,
        _venue: place?.venue || "",
        _location: place?.location || "",
        _urlTickets: urlShow || "",
        _isVirtual: false,
        _canceled: canceled,
        _title: showName || "",
        _image: artistImageUrl || artistThumbUrl || "",
        ctas: {},
      };
    }

    const venueName = bitEvent?.venue?.name || "";
    const locParts = [
      bitEvent?.venue?.city,
      bitEvent?.venue?.region,
      bitEvent?.venue?.country,
    ]
      .filter(Boolean)
      .join(", ");

    const ticketOffer =
      (bitEvent?.offers || []).find(
        (o) => o.type === "Tickets" && o.status !== "unavailable",
      ) || (bitEvent?.offers || [])[0];

    const urlTickets = (ticketOffer && ticketOffer.url) || bitEvent?.url || "";

    const followUrl = artistBitUrl
      ? buildFollowUrl(artistBitUrl, artistApiId)
      : "";
    const notifyUrl = buildNotifyUrl(bitEvent?.url || "", artistApiId);
    const rsvpUrl = buildRsvpUrl(bitEvent?.url || "", artistApiId);
    const pmcUrl = artistBitUrl
      ? buildPlayMyCityUrl(artistBitUrl, artistApiId)
      : "";
    const waitlistUrl = buildWaitlistUrl(bitEvent?.url || "", artistApiId);

    return {
      _artist: baseArtist,
      _date: bitEvent?.datetime || date,
      _venue: venueName,
      _location: locParts,
      _urlTickets: urlTickets,
      _isVirtual: isLivestream(bitEvent),
      _canceled: canceled,
      _title: bitEvent?.title || showName || "",
      _image: artistImageUrl || artistThumbUrl || "",
      ctas: { followUrl, notifyUrl, rsvpUrl, pmcUrl, waitlistUrl },
    };
  }, [
    bitEvent,
    artist,
    artistName,
    date,
    place,
    urlShow,
    canceled,
    showName,
    artistBitUrl,
    artistApiId,
    artistImageUrl,
    artistThumbUrl,
  ]);

  const openExternal = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleProtectedOpen = (e, url) => {
    if (!url) return;
    e?.preventDefault?.();

    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (
      ENABLE_EXTERNAL_LINK_MODAL &&
      localStorage.getItem("externalLinkDontShow") !== "true"
    ) {
      setSelectedUrl(url);
      setShowModal(true);
      return;
    }

    openExternal(url);
  };

  const confirmAndOpen = () => {
    openExternal(selectedUrl);
    setShowModal(false);
  };

  const fallbackLetter = (derived._artist || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <div className="flex flex-col w-full xl:w-[360px] bg-[#262627] rounded-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative w-full h-[220px] bg-black/30">
          {derived._image ? (
            <img
              src={derived._image}
              alt={`Imagen de ${derived._artist}`}
              loading="lazy"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // si falla la imagen, ocultarla
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/80 text-5xl font-black">
              {fallbackLetter}
            </div>
          )}

          {/* overlay suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#262627] via-transparent to-transparent" />
        </div>

        <div className="flex flex-col p-4 gap-5">
          {/* Info */}
          <div className="flex items-center gap-3">
            <MapMarker className="mt-[2px]" />
            <div className="flex flex-col text-white text-sm leading-tight">
              {derived._isVirtual ? (
                <>
                  <span>Evento virtual</span>
                  {derived._venue ? <span>{derived._venue}</span> : null}
                </>
              ) : (
                <>
                  <span>{derived._location || ""}</span>
                  <span>{derived._venue || ""}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[22px] md:text-[26px] font-black text-white leading-tight">
              {useFormattedDate(derived._date)}
            </h2>
            <h3 className="text-[18px] md:text-[22px] font-medium text-white leading-tight line-clamp-1">
              {derived._artist}
            </h3>
          </div>

          {/* Link principal */}
          {derived._urlTickets && (
            <a
              href={derived._urlTickets}
              onClick={(e) => handleProtectedOpen(e, derived._urlTickets)}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-[#00DAF0] hover:text-[#7cf3ff] transition"
            >
              <div className="flex items-center gap-2 text-lg">
                <IoTicketOutline />
                <span className="text-md underline underline-offset-2">
                  Ver evento
                </span>
              </div>
            </a>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-2">
            {derived.ctas.followUrl ? (
              <a
                href={derived.ctas.followUrl}
                onClick={(e) => handleProtectedOpen(e, derived.ctas.followUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 transition"
              >
                Follow
              </a>
            ) : null}

            {derived.ctas.notifyUrl ? (
              <a
                href={derived.ctas.notifyUrl}
                onClick={(e) => handleProtectedOpen(e, derived.ctas.notifyUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 transition"
              >
                Notify Me
              </a>
            ) : null}

            {derived.ctas.rsvpUrl ? (
              <a
                href={derived.ctas.rsvpUrl}
                onClick={(e) => handleProtectedOpen(e, derived.ctas.rsvpUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 transition"
              >
                RSVP
              </a>
            ) : null}

            {derived.ctas.waitlistUrl ? (
              <a
                href={derived.ctas.waitlistUrl}
                onClick={(e) =>
                  handleProtectedOpen(e, derived.ctas.waitlistUrl)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 transition"
              >
                Waitlist
              </a>
            ) : null}

            {derived.ctas.pmcUrl ? (
              <a
                href={derived.ctas.pmcUrl}
                onClick={(e) => handleProtectedOpen(e, derived.ctas.pmcUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 transition"
              >
                Play My City
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* External Link Modal (preparado, desactivado por flag) */}
      {ENABLE_EXTERNAL_LINK_MODAL && showModal && (
        <ExternalLinkModal
          url={selectedUrl}
          onClose={() => setShowModal(false)}
          onConfirm={confirmAndOpen}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          message="Para acceder a los shows primero debes iniciar sesión"
        />
      )}
    </>
  );
};

export default ShowCard;
