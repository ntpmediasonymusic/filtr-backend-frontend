/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoArrowForward, IoCalendarOutline } from "react-icons/io5";
import MapMarker from "../../assets/icons/MapMarker";
import { formatEventDate } from "../../utils/gallery";
import { getStatusMeta, getCoverGradient } from "./galleryPresentation";

export default function EventCard({ event, onSelect, priority = false }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const statusMeta = getStatusMeta(event.status);
  const showArtist =
    event.artist && !event.title.toLowerCase().includes(event.artist.toLowerCase());
  const hasCover = !!event.cover?.source && !coverFailed;

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className="group flex flex-col w-full text-left bg-[#262627] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#00DAF0]/60 transition cursor-pointer"
    >
      {/* Portada */}
      <div className="relative w-full before:block before:pt-[62%]">
        {hasCover ? (
          <img
            src={event.cover.source}
            alt={event.cover.alt || event.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onError={() => setCoverFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: getCoverGradient(event.id || event.slug) }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-black/60 text-white">
            {event.eventType}
          </span>
        </div>

        {statusMeta && (
          <span
            className={`absolute top-3 right-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col p-4 gap-2">
        <h3 className="text-white font-montserrat font-bold text-base sm:text-lg leading-tight line-clamp-2">
          {event.title}
        </h3>

        {showArtist && (
          <p className="text-white/70 text-sm line-clamp-1">{event.artist}</p>
        )}

        <p className="flex items-center gap-1.5 text-white/60 text-xs sm:text-sm">
          <MapMarker width="14" height="18" className="shrink-0" />
          {event.city}, {event.country}
        </p>

        <p className="flex items-center gap-1.5 text-white/60 text-xs sm:text-sm">
          <IoCalendarOutline className="text-[#00DAF0] shrink-0" size={14} />
          {formatEventDate(event.date, { style: "short" })}
        </p>

        <span className="mt-2 inline-flex items-center gap-2 text-[#00DAF0] group-hover:text-[#7cf3ff] transition text-sm font-semibold">
          Ver galería
          <IoArrowForward />
        </span>
      </div>
    </button>
  );
}
