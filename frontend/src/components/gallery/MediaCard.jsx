/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoPlay, IoImageOutline } from "react-icons/io5";
import { formatMediaDuration } from "../../utils/gallery";

export default function MediaCard({ item, onOpen }) {
  const [failed, setFailed] = useState(false);
  const ratio =
    item.width && item.height ? (item.height / item.width) * 100 : 100;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full overflow-hidden rounded-lg bg-[#1c1d1f] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
      style={{ paddingTop: `${ratio}%` }}
      aria-label={item.title || item.alt || "Ver medio"}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#262627] text-white/40">
          <IoImageOutline size={28} />
        </div>
      ) : (
        <img
          src={item.thumbnail || item.source}
          alt={item.alt || ""}
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {item.type === "video" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white">
              <IoPlay size={18} />
            </span>
          </div>
          {Number.isFinite(item.duration) && (
            <span className="absolute bottom-2 right-2 text-[11px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded">
              {formatMediaDuration(item.duration)}
            </span>
          )}
        </>
      )}
    </button>
  );
}
