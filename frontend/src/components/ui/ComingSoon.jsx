import { FaTools } from "react-icons/fa"; // Ícono de construcción

// eslint-disable-next-line react/prop-types
const ComingSoon = ({ color }) => {
  return (
    <div
      className="w-full rounded-2xl p-6 flex flex-col items-center justify-center text-white text-center"
      style={{ backgroundColor: color }} 
    >
      <h2 className="text-xl md:text-3xl font-bold mb-4">Próximamente</h2>

      <div className="flex flex-col md:flex-row items-center gap-3 text-sm md:text-xl">
        <FaTools className="text-3xl md:text-4xl" />
        <span>Este sitio todavía está en construcción</span>
      </div>
    </div>
  );
};

export default ComingSoon;
