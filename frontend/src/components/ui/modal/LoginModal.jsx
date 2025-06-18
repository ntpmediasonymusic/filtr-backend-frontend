/* eslint-disable react/prop-types */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" />

      {/* Modal centered */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          ref={ref}
          className="flex flex-col gap-6 w-full max-w-[500px] bg-[#282828] p-8 rounded-[16px] shadow-2xl relative"
        >
          {/* Contenido del modal */}
          <div className="text-center">
            <h3 className="text-white text-xl font-bold mb-4">
              Para guardar tus playlist favoritas primero debes de iniciar
              sesión
            </h3>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#B9F2CD] text-black py-3 px-6 rounded-[8px] font-semibold hover:bg-[#a8e3bc] transition-all duration-200 cursor-pointer"
            >
              INICIAR SESIÓN
            </button>
          </div>
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
