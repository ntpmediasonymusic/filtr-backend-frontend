import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/backendApi";
import { usePlaylists } from "../../../context/PlaylistContext"; // <- importar
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";
import LockIcon from "../../../assets/icons/LockIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { AiFillGoogleCircle } from "react-icons/ai";
// import { MdOutlineFacebook } from "react-icons/md";
import UserBigCircleIcon from "../../../assets/icons/UserBigCircleIcon";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const { refreshPlaylists } = usePlaylists(); // <- hook

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "El e-mail es obligatorio.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errs.email = "El e-mail no es válido.";
    if (!password) errs.password = "La contraseña es obligatoria.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setApiError("");
    if (Object.keys(errs).length === 0) {
      try {
        const { data } = await login({ email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // <-- refrescar playlists ahora que hay token y user
        await refreshPlaylists();
        navigate("/");
      } catch (err) {
        if (err.response?.status === 401) {
          setApiError(err.response.data.message || "Credenciales inválidas");
        } else {
          console.error(err);
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-10 rounded-[22px] max-w-[800px] w-full mx-auto flex flex-col gap-4 sm:gap-5"
    >
      <div className="w-full flex items-center justify-center">
        <UserBigCircleIcon />
      </div>
      {apiError && (
        <p className="mt-2 text-sm text-red-600 text-center">{apiError}</p>
      )}
      {/* E-mail */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
            <EnvelopeIcon className="text-[#ca249c]" />
          </div>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      {/* Contraseña */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
            <LockIcon className="text-[#ca249c]" />
          </div>
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="text-gray-600"
          >
            {showPwd ? (
              <FaEyeSlash className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-[#ca249c] transition-transform duration-200 ease-in-out" />
            ) : (
              <FaEye className="w-4 h-4 sm:w-5 sm:h-5 text-[#ca249c] transition-transform duration-200 ease-in-out" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>
      {/* Recordar y Olvidaste */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between items-start sm:items-center text-[#131517]">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 accent-[#ca249c]" />
          <span className="text-xs sm:text-sm font-semibold text-[#131517]">
            Recordar la contraseña
          </span>
        </label>
        <a href="#" className="text-xs sm:text-sm font-semibold text-[#131517]">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      {/* Botón Entrar */}
      <button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-[#ca249c] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base"
      >
        Entrar
      </button>
      {/* Link Sign Up */}
      <div className="text-center text-[#131517] mt-1 sm:mt-2">
        <span className="text-sm sm:text-base">¿No tienes una cuenta?</span>
        <br />
        <a
          href="/signup"
          className="font-semibold text-[#131517] text-sm sm:text-base"
        >
          Regístrate Aquí
        </a>
      </div>
      {/* Separador */}
      {/* <div className="flex items-center my-3 sm:my-4 text-[#131517]">
        <div className="flex-1 h-px bg-[#131517]" />
        <span className="px-2 sm:px-3 whitespace-nowrap text-xs sm:text-base">
          O continúa con:
        </span>
        <div className="flex-1 h-px bg-[#131517]" />
      </div> */}
      {/* Botones Google/Facebook */}
      {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="button"
          className="flex-1 sm:min-w-[200px] flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-[#004fd4] text-white rounded-lg transition hover:opacity-90 text-sm sm:text-base"
        >
          <AiFillGoogleCircle className="w-5 h-5 sm:w-6 sm:h-6" /> Google
        </button>
        <button
          type="button"
          className="flex-1 sm:min-w-[200px] flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-[#004fd4] text-white rounded-lg transition hover:opacity-90 text-sm sm:text-base"
        >
          <MdOutlineFacebook className="w-5 h-5 sm:w-6 sm:h-6" /> Facebook
        </button>
      </div> */}
    </form>
  );
};

export default LoginForm;
