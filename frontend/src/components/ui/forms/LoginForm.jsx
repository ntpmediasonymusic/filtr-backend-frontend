import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  login,
  resendVerification,
  spotifyLogin,
} from "../../../api/backendApi";
import { usePlaylists } from "../../../context/PlaylistContext";
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";
import LockIcon from "../../../assets/icons/LockIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserBigCircleIcon from "../../../assets/icons/UserBigCircleIcon";
import VerificationEmailSent from "./VerificationEmailSent";
import ClipLoader from "react-spinners/ClipLoader";
import RegionLink from "../../../router/RegionLink";
import { FaSpotify } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [verifyApiError, setVerifyApiError] = useState(false);
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [isSpotifyFlow, setIsSpotifyFlow] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const autoLoginTriggeredRef = useRef(false);

  const navigate = useNavigate();
  const { refreshPlaylists } = usePlaylists();

useEffect(() => {
  // Puede venir como ?spotifyToken=... o como ?token=...
  const tokenFromUrl =
    searchParams.get("spotifyToken") || searchParams.get("token");

  // Si no hay token o ya hicimos el auto-login, no hacemos nada
  if (!tokenFromUrl || autoLoginTriggeredRef.current) return;

  autoLoginTriggeredRef.current = true; // evitar duplicados (StrictMode, etc.)

  setSpotifyToken(tokenFromUrl);
  setIsSpotifyFlow(true);

  // Intentar decodificar el email del JWT de Spotify
  let emailFromToken = "";
  try {
    const base64Payload = tokenFromUrl
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payload = JSON.parse(atob(base64Payload));

    if (payload.email) {
      emailFromToken = payload.email;
      setEmail(payload.email);
    }
  } catch (err) {
    console.error("Error decodificando token de Spotify en login:", err);
  }

  // 🔹 Auto-login inmediato
  const doAutoLogin = async () => {
    try {
      setIsLoading(true);
      setApiError("");
      setErrors({});

      const payload = {
        email: emailFromToken,
        spotifyToken: tokenFromUrl,
      };

      const { data } = await login(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await refreshPlaylists();
      navigate("/");
    } catch (err) {
      console.error("Error en auto-login con Spotify:", err);
      setIsSpotifyFlow(false);
      const msg =
        err.response?.data?.message ||
        "No se pudo iniciar sesión con Spotify. Intenta de nuevo.";
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  doAutoLogin();
}, [searchParams, login, refreshPlaylists, navigate]);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "El e-mail es obligatorio.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errs.email = "El e-mail no es válido.";

    if (!isSpotifyFlow) {
      if (!password) errs.password = "La contraseña es obligatoria.";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      // 🔹 Si venimos de Spotify → mandamos email + spotifyToken
      const payload =
        isSpotifyFlow && spotifyToken
          ? { email, spotifyToken }
          : { email, password };

      const { data } = await login(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await refreshPlaylists();
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Error inesperado.";

      if (status === 401) {
        setApiError(msg);
      } else if (status === 403) {
        // Usuario sin verificar
        setApiError(msg);
        setVerifyApiError(true);
      } else if (status === 400 && err.response.data.errors) {
        const apiErrs = {};
        err.response.data.errors.forEach((e) => {
          apiErrs[e.param] = e.msg;
        });
        setErrors(apiErrs);
      } else {
        setApiError("Ocurrió un error inesperado. Intenta de nuevo.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setShowVerifyNotice(true);
      await resendVerification(email);
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Error al reenviar el correo."
      );
    }
  };

  if (showVerifyNotice) {
    return <VerificationEmailSent email={email} fromLogin={true} />;
  }

  // Placeholder para el futuro flujo de Spotify
  const handleContinueWithSpotify = () => {
    spotifyLogin();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-10 rounded-[22px] max-w-[800px] w-full mx-auto flex flex-col gap-4 sm:gap-5"
    >
      <div className="w-full flex items-center justify-center">
        <UserBigCircleIcon className="w-28 h-28 md:w-48 md:h-48" />
      </div>

      {/* E-mail */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2 sm:gap-3">
          <EnvelopeIcon className="text-[#ca249c] w-6 h-6 sm:w-8 sm:h-8" />
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
          <LockIcon className="text-[#ca249c] w-6 h-6 sm:w-8 sm:h-8" />
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
              <FaEyeSlash className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-[#ca249c]" />
            ) : (
              <FaEye className="w-4 h-4 sm:w-5 sm:h-5 text-[#ca249c]" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <div className="flex justify-end text-[#131517] text-xs sm:text-sm">
        <RegionLink
          to="/forgot-password"
          className="underline underline-offset-2 font-semibold"
        >
          ¿Olvidaste tu contraseña?
        </RegionLink>
      </div>

      {/* Mensaje backend */}
      {apiError && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-600 font-bold text-center">
            {apiError}
          </p>
          {verifyApiError && (
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-[#131517] cursor-pointer underline underline-offset-2"
            >
              Reenviar correo
            </button>
          )}
        </div>
      )}

      {/* Entrar */}
      <button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-[#ca249c] cursor-pointer text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base"
      >
        {isLoading ? <ClipLoader size={16} color="#FFFFFF" /> : "ACCEDER"}
      </button>

      {/* Divider + botón CONTINUAR CON SPOTIFY */}
      <div className="my-4">
        <div className="h-[1px] w-full bg-[#ca249c]" />
      </div>

      <button
        type="button"
        onClick={handleContinueWithSpotify}
        className="w-full flex col justify-center items-center gap-2 sm:gap-3 py-2.5 sm:py-3 bg-[#1DB954] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base"
      >
        <FaSpotify className="text-[#ffffff] w-5 h-5 sm:w-6.5 sm:h-6.5 flex-shrink-0" />
        CONTINUAR CON SPOTIFY
      </button>
      {isSpotifyFlow && isLoading && (
        <p className="text-center text-sm text-[#131517]">
          Iniciando sesión con tu cuenta de Spotify...
        </p>
      )}

      {/* Link a signup */}
      <div className="text-center text-[#131517] mt-1 sm:mt-2 text-sm sm:text-base">
        ¿Aún no eres miembro FILTR?
        <br />
        <RegionLink to="/signup" className="underline font-semibold">
          Regístrate aquí
        </RegionLink>
      </div>
    </form>
  );
};

export default LoginForm;
