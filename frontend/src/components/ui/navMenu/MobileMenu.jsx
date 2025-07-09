/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const MobileMenu = ({ menuOptions, toggleMenu }) => {

  const [isScrolled, setIsScrolled] = useState(false); 

  // Helper para leer exp del JWT
  const getTokenExp = (bearerToken) => {
    try {
      const token = bearerToken.split(" ")[1];
      const payload = token.split(".")[1];
      const decoded = JSON.parse(window.atob(payload));
      return decoded.exp;
    } catch {
      return null;
    }
  };

  // Comprueba si hay token válido
  const token = localStorage.getItem("token");
  let isAuthenticated = false;
  if (token) {
    const exp = getTokenExp(token);
    if (exp && exp * 1000 > Date.now()) {
      isAuthenticated = true;
    }
  }

  // Detectar scroll
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`absolute ${
        isScrolled || window.scrollY > 0 ? "top-11" : "top-18"
      } right-0 w-2/3 bg-[#282828] rounded-[12px] p-4 flex flex-col space-y-4 md:hidden z-10 shadow-lg`}
    >
      {menuOptions.map((option) => (
        <div key={option.name} className="relative">
          <NavLink
            to={option.route}
            onClick={toggleMenu}
            className={`flex items-center space-x-2 text-lg font-medium px-2 py-2 transition duration-300 ${
              location.pathname === option.route
                ? "text-[#00DAF0] border-b-2 border-[#00DAF0]"
                : "text-white"
            }`}
          >
            <span className="text-xl">{option.icon}</span>
            <span>{option.name}</span>
          </NavLink>
        </div>
      ))}

      {/* Separador */}
      {!isAuthenticated && (
        <div className="border-t border-gray-600 my-2"></div>
      )}

      {/* Opciones de autenticación */}
      {!isAuthenticated && (
        <>
          <NavLink
            to="/login"
            onClick={toggleMenu}
            className="flex items-center space-x-2 text-lg font-medium px-2 py-2 text-white hover:text-[#ffeda8] transition duration-300"
          >
            <FaSignInAlt className="text-xl" />
            <span>Acceder</span>
          </NavLink>

          <NavLink
            to="/signup"
            onClick={toggleMenu}
            className="flex items-center space-x-2 text-lg font-medium px-2 py-2 text-white hover:text-[#ffeda8] transition duration-300"
          >
            <FaUserPlus className="text-xl" />
            <span>Registrarse</span>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
