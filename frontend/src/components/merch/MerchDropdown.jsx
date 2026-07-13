/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function MerchDropdown({
  label,
  renderLabel,
  children,
  panelClassName = "",
  usePortal = false,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const updateCoords = () => {
    if (!usePortal || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 8, left: rect.left });
  };

  const handleToggle = () => {
    if (!open) updateCoords();
    setOpen((o) => !o);
  };

  useEffect(() => {
    function onDocClick(e) {
      const insideTrigger = containerRef.current?.contains(e.target);
      const insidePanel = panelRef.current?.contains(e.target);
      if (!insideTrigger && !insidePanel) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onReposition() {
      updateCoords();
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    if (usePortal) {
      window.addEventListener("resize", onReposition);
      window.addEventListener("scroll", onReposition, true);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
      if (usePortal) {
        window.removeEventListener("resize", onReposition);
        window.removeEventListener("scroll", onReposition, true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePortal]);

  const panel = (
    <div
      ref={panelRef}
      style={usePortal && coords ? { top: coords.top, left: coords.left } : undefined}
      className={`${
        usePortal ? "fixed" : "absolute mt-2"
      } z-50 bg-[#282828] rounded-[12px] shadow-lg p-3 ${panelClassName}`}
    >
      {typeof children === "function"
        ? children({ close: () => setOpen(false) })
        : children}
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white bg-white/5 hover:bg-white/10 border border-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00DAF0]"
      >
        {renderLabel ? renderLabel() : <span>{label}</span>}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (usePortal ? createPortal(panel, document.body) : panel)}
    </div>
  );
}
