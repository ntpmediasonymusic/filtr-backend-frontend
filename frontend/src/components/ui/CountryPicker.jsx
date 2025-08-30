/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useRegion } from "../../router/RegionContext";

const COUNTRIES = [
  { code: "cr", name: "Costa Rica" },
  { code: "do", name: "Rep. Dominicana" },
  // { code: "pa", name: "Panamá" },
];

function savePreferredRegion(code) {
  try {
    localStorage.setItem("filtr_region", code);
  } catch {
    /* no-op */
  }
}

export default function CountryPicker({ isAuthenticated = false}) {
  const { region, setRegion } = useRegion();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const current = COUNTRIES.find((c) => c.code === region) ?? COUNTRIES[0];

  // Cerrar al hacer click fuera
  useEffect(() => {
    function onDocClick(e) {
      if (!btnRef.current || !listRef.current) return;
      if (
        !btnRef.current.contains(e.target) &&
        !listRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function onKeyDown(e) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      // foco al primer item
      const first = listRef.current?.querySelector('[role="option"]');
      first?.focus();
    }
  }

  function selectCountry(code) {
    // 1) persistir preferencia
    savePreferredRegion(code);
    // 2) cambiar región (esto actualizará la URL preservando la subruta)
    setRegion(code);
    // 3) cerrar menú
    setOpen(false);

    // (Opcional) enviar evento a GTM si usas dataLayer:
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "change_region", region: code });
    } catch {
      /* no-op */
    }
  }

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      {/* Botón */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center rounded-[12px] ${
          isAuthenticated ? "px-1" : "px-2"
        } cursor-pointer`}
        onClick={() => setOpen((o) => !o)}
      >
        {/* Bandera actual (flag-icons) */}
        <span
          className={`fi fi-${current.code} rounded-sm`}
          style={{ width: 20, height: 14 }}
        />
      </button>

      {/* Lista */}
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 mt-2 ${
            isAuthenticated ? "right-[-8.5px]" : "right-[-4.3px]"
          } rounded-[12px] bg-[#282828]`}
        >
          {COUNTRIES.map((c) => (
            <li key={c.code}>
              <button
                role="option"
                aria-selected={c.code === region}
                className={`flex w-full items-center rounded-lg px-3 py-2 focus:bg-white/10 outline-none ${
                  c.code === region ? "bg-white/18" : "hover:bg-white/10"
                }`}
                onClick={() => selectCountry(c.code)}
              >
                <span
                  className={`fi fi-${c.code} rounded-sm`}
                  style={{ width: 20, height: 14 }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
