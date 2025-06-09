/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

export default function DeleteAccountModal({ onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          ref={ref}
          className="bg-[#282828] p-6 rounded-[12px] w-full max-w-sm text-white flex flex-col gap-5"
        >
          <p className="text-lg">
            ¿Estás seguro de que quieres{" "}
            <span className="font-semibold">eliminar tu cuenta</span> de Filtr?<br/>
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
