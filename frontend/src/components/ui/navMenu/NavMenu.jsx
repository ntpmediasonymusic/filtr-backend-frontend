import { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import NavMenuItem from "./NavMenuItem";
import MobileMenu from "./MobileMenu";
import logo from "../../../assets/images/filtr_logo_white.svg";
import GenresIcon from "../../../assets/icons/GenresIcon";
import HomeIcon from "../../../assets/icons/HomeIcon";
import MoodsIcon from "../../../assets/icons/MoodsIcon";
import ShowsIcon from "../../../assets/icons/ShowsIcon";
import TrendIcon from "../../../assets/icons/TrendIcon";
import WinWinIcon from "../../../assets/icons/WinWinIcon";
import { useSearch } from "../../../context/SearchContext";
import RegionNavLink from "../../../router/RegionNavLink";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const { setSearchQuery } = useSearch();

  const toggleMenu = () => {
    setSearchQuery("");
    setIsOpen(!isOpen);
  };

  // Cerrar menú al click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Detectar scroll
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const alpha = isScrolled ? 0.8 : 1;

  // Gradiente con RGBA dinámico
  const gradient = `
    linear-gradient(
      to right,
      rgba(202,36,156,${alpha}) 0%,
      rgba(202,36,156,${alpha}) 20%,
      rgba(0,79,212,${alpha}) 70%,
      rgba(0,79,212,${alpha}) 100%
    )
  `;

  const menuOptions = [
    { name: "Inicio", icon: <HomeIcon />, route: "/" },
    { name: "Géneros", icon: <GenresIcon />, route: "/genres" },
    { name: "Moods", icon: <MoodsIcon />, route: "/moods" },
    { name: "Trending", icon: <TrendIcon />, route: "/trending" },
    { name: "Shows", icon: <ShowsIcon />, route: "/shows" },
    { name: "Premios", icon: <WinWinIcon />, route: "/prizes" },
  ];

  return (
    <nav
      ref={menuRef}
      className={`
        fixed top-0 left-0 right-0 z-50 flex items-center justify-between text-white
        px-4 
        ${isScrolled ? "backdrop-blur-sm py-1" : "py-4"}
        transition-[padding] duration-200 ease-in-out shadow-md
      `}
      style={{
        backgroundImage: gradient,
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <RegionNavLink to="/">
          <img
            src={logo}
            alt="Logo Filtr"
            className="w-40 md:w-50 cursor-pointer"
            loading="lazy"
          />
        </RegionNavLink>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-1">
        {menuOptions.map((option) => (
          <NavMenuItem
            key={option.name}
            name={option.name}
            icon={option.icon}
            route={option.route}
            toggleMenu={toggleMenu}
          />
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <MobileMenu menuOptions={menuOptions} toggleMenu={toggleMenu} />
      )}
    </nav>
  );
};

export default NavMenu;
