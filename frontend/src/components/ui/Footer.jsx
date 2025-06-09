import { FaInstagram, FaTiktok, FaSpotify } from "react-icons/fa";
import logo from "../../assets/images/filtr_logo_white.png";

const Footer = () => {
  return (
    <footer
      className="px-6 py-8 flex flex-col items-center"
      style={{
        backgroundColor: "rgb(0, 79, 212)",
        backgroundImage:
          "linear-gradient(to right, rgb(202, 36, 156) 0%, rgb(202, 36, 156) 20%, rgb(0, 79, 212) 70%, rgb(0, 79, 212) 100%)",
      }}
    >
      {/* Logo */}
      <img src={logo} alt="Filtr Logo" className="w-16 md:w-24 mb-4" />

      {/* Redes Sociales */}
      <div className="flex space-x-5 md:space-x-9">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-3xl md:text-5xl transition transform hover:text-gray-300 hover:scale-120"
        >
          <FaInstagram />
        </a>

        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-3xl md:text-5xl transition transform hover:text-gray-300 hover:scale-120"
        >
          <FaTiktok />
        </a>

        <a
          href="https://www.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-3xl md:text-5xl transition transform hover:text-gray-300 hover:scale-120"
        >
          <FaSpotify />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
