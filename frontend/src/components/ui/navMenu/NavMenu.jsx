import { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import NavMenuItem from "./NavMenuItem";
import MobileMenu from "./MobileMenu";
import logo from "../../../assets/images/filtr_logo_white.svg";
import GenresIcon from "../../../assets/icons/GenresIcon";
import HomeIcon from "../../../assets/icons/HomeIcon";
import MoodsIcon from "../../../assets/icons/MoodsIcon";
// import QuizzesIcon from "../../../assets/icons/QuizzesIcon";
import ShowsIcon from "../../../assets/icons/ShowsIcon";
import TrendIcon from "../../../assets/icons/TrendIcon";
import WinWinIcon from "../../../assets/icons/WinWinIcon";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle clicks outside of menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuOptions = [
    { name: "Inicio", icon: <HomeIcon />, route: "/" },
    { name: "Géneros", icon: <GenresIcon />, route: "/genres" },
    { name: "Moods", icon: <MoodsIcon />, route: "/moods" },
    { name: "Trending", icon: <TrendIcon />, route: "/trending" },
    { name: "Shows", icon: <ShowsIcon />, route: "/shows" },
    // { name: "Quizzes", icon: <QuizzesIcon />, route: "/quizzes" },
    { name: "Premios", icon: <WinWinIcon />, route: "/prizes" },
  ];

  return (
    <nav
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between text-white px-4 py-5 shadow-md"
      style={{
        backgroundColor: "rgb(0, 79, 212)",
        backgroundImage:
          "linear-gradient(to right, rgb(202, 36, 156) 0%, rgb(202, 36, 156) 20%, rgb(0, 79, 212) 70%, rgb(0, 79, 212) 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <NavLink to="/">
          <img
            src={logo}
            alt="Logo Filtr"
            className="w-40 md:w-50 cursor-pointer"
          />
        </NavLink>
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

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <MobileMenu
          menuOptions={menuOptions}
          toggleMenu={toggleMenu}
        />
      )}
    </nav>
  );
};

export default NavMenu;