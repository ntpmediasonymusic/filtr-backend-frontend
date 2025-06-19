/* eslint-disable react/prop-types */
import UserCircleIcon from "../../../assets/icons/UserCircleIcon";
import { NavLink } from "react-router-dom";
import { FaHeart, FaSignOutAlt } from "react-icons/fa";

const ProfileModal = ({ onClose }) => {
  // Obtenemos el usuario de localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onClose();
    window.location.reload();
  };

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 sm:-left-14 md:left-auto md:-right-33 md:transform-none mt-2 flex flex-col w-auto bg-[#282828] p-4 rounded-[12px] text-white z-20">
      {/* Perfil info */}
      <div className="flex flex-row gap-4 mb-4">
        <div>
          <UserCircleIcon className="w-10 h-10 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{user.firstName}</span>
          <span className="text-sm text-gray-400">{user.email}</span>
          <NavLink
            to="/edit-account"
            onClick={onClose}
            className="text-[#00DAF0] hover:underline text-sm"
          >
            Editar perfil
          </NavLink>
        </div>
      </div>

      <hr className="border-gray-700 mb-4" />

      {/* Mis Playlist favoritas */}
      <NavLink
        to="/favorite-playlists"
        onClick={onClose}
        className="flex flex-row items-center gap-4 py-2 pl-2 hover:bg-white/10 rounded"
      >
        <FaHeart />
        <span>Mis Playlist favoritas</span>
      </NavLink>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex flex-row items-center gap-4 py-2 pl-2 hover:bg-white/10 rounded text-left"
      >
        <FaSignOutAlt />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};

export default ProfileModal;
