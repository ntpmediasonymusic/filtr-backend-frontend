/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const MobileMenu = ({ menuOptions, toggleMenu }) => {

  const [isScrolled, setIsScrolled] = useState(false); 

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
    </div>
  );
};

export default MobileMenu;
