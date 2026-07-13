/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import MerchDropdown from "./MerchDropdown";

export default function MerchPriceFilter({ min, max, onApply }) {
  const [localMin, setLocalMin] = useState(min ?? "");
  const [localMax, setLocalMax] = useState(max ?? "");

  useEffect(() => {
    setLocalMin(min ?? "");
    setLocalMax(max ?? "");
  }, [min, max]);

  const hasActive = min != null || max != null;

  const parseValue = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const applyValues = () => {
    onApply({ min: parseValue(localMin), max: parseValue(localMax) });
  };

  const clearValues = () => {
    setLocalMin("");
    setLocalMax("");
    onApply({ min: null, max: null });
  };

  return (
    <MerchDropdown
      label={hasActive ? "Precio •" : "Precio"}
      panelClassName="w-[min(90vw,360px)]"
    >
      {({ close }) => (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col text-xs text-gray-400 gap-1 min-w-0">
              Mín.
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                placeholder="$0"
                className="w-full min-w-0 bg-[#131517] text-white text-sm rounded-lg px-2 py-1.5 border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
              />
            </label>
            <label className="flex flex-col text-xs text-gray-400 gap-1 min-w-0">
              Máx.
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                placeholder="$999"
                className="w-full min-w-0 bg-[#131517] text-white text-sm rounded-lg px-2 py-1.5 border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
              />
            </label>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={clearValues}
              className="text-xs text-gray-400 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => {
                applyValues();
                close();
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#CA249C] text-white hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAF0]"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </MerchDropdown>
  );
}
