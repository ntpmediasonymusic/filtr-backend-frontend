/* eslint-disable react/prop-types */
import { useState } from "react";
import MapMarker from "../../assets/icons/MapMarker";
import { IoTicketOutline } from "react-icons/io5";
import useFormattedDate from "../../hooks/shows/useFormattedDate";
import ExternalLinkModal from "../ui/modal/ExternalLinkModal";
import LoginModal from "../ui/modal/LoginModal";

const ShowCard = ({
  artist,
  showName,
  urlShow,
  urlShowImage,
  date, // "DD/MM/YYYY"
  place,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check login
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const bearer = localStorage.getItem("token");
  const loggedIn = !!bearer && !!user?.id;

  const handleClickLink = (e) => {
    if (!loggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    } else if (
      urlShow &&
      localStorage.getItem("externalLinkDontShow") !== "true"
    ) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  const confirmAndOpen = () => {
    window.open(urlShow, "_blank", "noopener noreferrer");
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row w-full xl:w-[660px] bg-[#262627] rounded-lg p-4 gap-5">
        {urlShow && (
          <div className="flex-shrink-0 w-full xl:w-[225px]">
            <a
              href={urlShow}
              onClick={handleClickLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <ShowCardImage src={urlShowImage} alt={showName} date={date} />
            </a>
          </div>
        )}

        {/* Show Info */}
        <div className="flex flex-col justify-center gap-6 w-full">
          <div className="flex items-center gap-3">
            <MapMarker className="mt-[2px]" />
            <div className="flex xl:flex-col text-white text-sm leading-tight">
              <span>{place.location}</span>
              <span className="ml-1 xl:ml-0">{place.venue}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 xl:ml-8">
            <h2 className="xl:text-[28px] font-black text-white leading-tight">
              {useFormattedDate(date)}
            </h2>
            <h2 className="xl:text-[26px] font-medium text-white leading-tight line-clamp-1">
              {artist}
            </h2>
          </div>

          <a
            href={urlShow}
            onClick={handleClickLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-[#00DAF0] hover:text-[#7cf3ff] transition xl:ml-8"
          >
            <div className="flex items-center gap-2 text-lg">
              <IoTicketOutline />
              <span className="text-md underline underline-offset-2">
                Ver evento
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* External Link Modal */}
      {showModal && (
        <ExternalLinkModal
          url={urlShow}
          onClose={() => setShowModal(false)}
          onConfirm={confirmAndOpen}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          message="Para acceder a los shows primero debes iniciar sesión"
        />
      )}
    </>
  );
};

function ShowCardImage({ src, alt, date }) {
  const [loaded, setLoaded] = useState(false);

  // Parseamos "DD/MM/YYYY"
  const [day, month, year] = date.split("/").map(Number);
  const eventDate = new Date(year, month - 1, day);
  const today = new Date();
  // Normalizamos a medianoche
  const diffMs = eventDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let overlayText = "";
  let textColor = "";
  if (diffDays < 0) {
    overlayText = "FINALIZADO";
    textColor = "text-red-500";
  } else if (diffDays === 0) {
    overlayText = "¡ES HOY!";
    textColor = "text-blue-400";
  } else if (diffDays === 1) {
    overlayText = "¡ES MAÑANA!";
    textColor = "text-blue-400";
  } else if (diffDays === 2) {
    overlayText = "FALTAN 2 DÍAS";
    textColor = "text-yellow-400";
  } else if (diffDays === 3) {
    overlayText = "FALTAN 3 DÍAS";
    textColor = "text-yellow-400";
  } else if (diffDays > 0 && diffDays < 15) {
    overlayText = "MUY PRONTO";
    textColor = "text-yellow-400";
  }

  return (
    <div className="relative w-full before:block before:pt-[100%] rounded-md overflow-hidden bg-gray-700">
      {/* Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      )}

      {/* Imagen */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Overlay si hay texto */}
      {overlayText && (
        <div className="flex justify-center absolute bottom-0 left-0 w-full px-2 py-2 bg-black/80">
          <span
            className={`leading-tight font-black text-[24px] sm:text-[24px] md:text-[24px] lg:text-[18px] xl:text-[18px] ${textColor}`}
          >
            {overlayText}
          </span>
        </div>
      )}
    </div>
  );
}

export default ShowCard;
