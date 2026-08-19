/* eslint-disable react/prop-types */
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function GalleryPagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <button
        className="rounded-xl border bg-[#00DAF0] text-black px-4 py-2 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onPrev}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <IoChevronBack />
      </button>

      <span className="text-sm text-white/70">
        Página {page} de {totalPages}
      </span>

      <button
        className="rounded-xl border bg-[#00DAF0] text-black px-4 py-2 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <IoChevronForward />
      </button>
    </div>
  );
}
