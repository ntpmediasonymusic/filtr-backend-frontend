import { NavLink } from "react-router-dom";
import { useSortedShows } from "../../hooks/shows/useSortedShows";

// Función para obtener la abreviatura del mes en español
const getMonthAbbreviation = (month) => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return months[month - 1] || "";
};

// Función para formatear la fecha en "04 de Enero 2025"
const formatDate = (dateString) => {
  const parts = dateString.split("/");
  const day = parts[0].padStart(2, "0"); // Asegurar 2 dígitos en el día
  const month = getMonthAbbreviation(parseInt(parts[1], 10));
  const year = parts[2];

  return `${day} de ${month} ${year}`;
};

// Función para quitar el cero a la izquierda del día
const formatDay = (day) => {
  return parseInt(day, 10);
};

const QuizzesPreview = () => {
  const shows = useSortedShows();

  // Mostrar diferente cantidad de shows dependiendo del tamaño de pantalla
  const displayedShows =
    window.innerWidth >= 1024
      ? shows.slice(0, 12)
      : window.innerWidth >= 768
      ? shows.slice(0, 8)
      : shows.slice(0, 6);

  return (
    <>
      <h2 className="pb-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-yellow-600 to-violet-600 bg-clip-text text-transparent">
        Shows
      </h2>
      <div className="flex flex-col bg-[#1f1f1f] rounded-lg shadow-lg p-6 md:p-8">
        {/* Contenedor de shows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayedShows.map((show) => {
            const [day, month] = show.date.split("/");
            return (
              <div key={show.showName} className="relative group">
                {/* Imagen del Show */}
                <a
                  href={show.urlShow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative"
                >
                  <img
                    src={show.urlShowImage}
                    alt={show.showName}
                    className="w-full h-auto rounded-lg transition transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Componente de Fecha */}
                  <div className="absolute top-2 right-2 flex flex-col text-center rounded-md overflow-hidden shadow-md">
                    <span className="bg-purple-600 text-white text-xs md:text-sm px-2 py-1 font-semibold">
                      {getMonthAbbreviation(parseInt(month, 10))}
                    </span>
                    <span className="bg-white text-black text-xs md:text-sm px-2 py-1 font-bold">
                      {formatDay(day)}
                    </span>
                  </div>
                </a>

                {/* Nombre del Show */}
                <a
                  href={show.urlShow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-sm md:text-base font-bold text-white hover:text-[#f8cd28] transition truncate max-w-full"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {show.showName}
                </a>

                {/* Fecha y Ubicación */}
                <p className="text-xs md:text-sm text-gray-400">
                  {formatDate(show.date)}
                </p>
                <p
                  className="text-xs md:text-sm text-gray-400 truncate"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {show.location}
                </p>
              </div>
            );
          })}
        </div>

        {/* Botón para explorar más shows */}
        <NavLink to="/shows">
          <button className="w-full mt-6 px-4 py-2 bg-[#f8cd28] text-black font-bold rounded-lg hover:bg-[#ffeda8] transition">
            Explorar más Shows
          </button>
        </NavLink>
      </div>
    </>
  );
};

export default QuizzesPreview;
