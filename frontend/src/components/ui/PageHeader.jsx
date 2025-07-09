/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import SearchIcon from "../../assets/icons/SearchIcon";
import UserCircleIcon from "../../assets/icons/UserCircleIcon";
import ProfileModal from "./modal/ProfileModal";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useSearch } from "../../context/SearchContext";

const PageHeader = ({ welcomeMsg }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Comprueba si hay token válido y extrae user
  const token = localStorage.getItem("token");
  let isAuthenticated = false;
  let user = null;
  if (token) {
    const exp = getTokenExp(token);
    if (exp && exp * 1000 > Date.now()) {
      isAuthenticated = true;
      user = JSON.parse(localStorage.getItem("user") || "{}");
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showModal &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Mantener el foco en el input cuando hay búsqueda activa
  useEffect(() => {
    if (searchQuery && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchQuery]);

  // Detectar scroll
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floatingClasses =
    "fixed top-11 xl:top-14.5 left-0 px-4 pb-4 pt-0 md:py-4 z-14 bg-[rgba(19,21,23,0.8)] backdrop-blur-sm";

  return (
    <header
      className={`${
        isScrolled && floatingClasses
      } w-full flex flex-col xl:flex-row items-center xl:justify-between gap-4 transition-all`}
    >
      {/* Saludo */}
      
      <div className="w-full xl:w-auto text-center xl:text-left">
        {!isScrolled && (
        <h1 className="text-white font-bold text-lg md:text-[28px] font-montserrat">
          {welcomeMsg}
        </h1> 
      )}
      </div>
     

      {/* Zona de búsqueda + perfil / login-signup */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
        {/* Barra de búsqueda */}
        <div className="flex items-center bg-[#131517] rounded-full px-4 py-2 gap-2 border-2 border-[#00DAF0] w-full sm:w-100 max-w-sm">
          <SearchIcon className="text-[#00DAF0]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar playlists, géneros, moods..."
            className="flex-1 bg-transparent focus:outline-none text-white placeholder:text-gray-400 text-sm md:text-base"
          />
        </div>

        {!isAuthenticated ? (
          /* Si no hay usuario, muestra Login & Sign Up */
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <NavLink
              to="/login"
              className="flex items-center gap-2 px-2 py-2 text-white text-lg font-normal hover:opacity-60 whitespace-nowrap"
            >
              <FaSignInAlt />
              <span>Acceder</span>
            </NavLink>
            <div className="h-6 w-px bg-white mx-0" />
            <NavLink
              to="/signup"
              className="flex items-center gap-2 px-2 py-2 text-white text-lg font-normal hover:opacity-60 whitespace-nowrap"
            >
              <FaUserPlus />
              <span>Registrarse</span>
            </NavLink>
          </div>
        ) : (
          /* Si está autenticado, muestra botón de perfil */
          <div className="relative flex-shrink-0" ref={wrapperRef}>
            <button
              onClick={() => setShowModal((v) => !v)}
              className="flex items-center gap-2 text-white text-sm md:text-xl whitespace-nowrap"
            >
              <span>{user.firstName}</span>
              <UserCircleIcon className="text-white" width="30" height="30" />
            </button>
            {showModal && <ProfileModal onClose={() => setShowModal(false)} />}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;