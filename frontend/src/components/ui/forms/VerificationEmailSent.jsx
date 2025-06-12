/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resendVerification } from "../../../api/backendApi";
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";
import { FaSyncAlt } from "react-icons/fa";

const VerificationEmailSent = ({ email, fromLogin = "false" }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [counter, setCounter] = useState(60);
  const [isBlocked, setIsBlocked] = useState(true);
  const [apiMsg, setApiMsg] = useState("");
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Cuenta regresiva de 60s al montar:
  useEffect(() => {
    setIsBlocked(true);
    setCounter(60);
    setApiMsg("");

    timerRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsBlocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleResend = async () => {
    setIsBlocked(true);
    setCounter(60);
    setApiMsg("");

    // Reiniciar contador
    timerRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsBlocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const resp = await resendVerification(email);
      setApiMsg(resp.data.message || "Se ha enviado un nuevo correo.");
    } catch (err) {
      console.error(err);
      setApiMsg(
        err.response?.data?.message || "Hubo un error al reenviar el correo."
      );
    }
  };
  return (
    <div
      className="bg-white
                 p-5 sm:p-[40px] rounded-[22px] max-w-[800px] w-full
                 mx-auto flex flex-col gap-4 sm:gap-5"
    >
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-16 h-16 flex items-center justify-center bg-[#ca249c] rounded-full">
          <EnvelopeIcon className="text-white w-12 h-12" />
        </div>
        {!fromLogin && (
          <h2 className="text-center text-2xl font-bold">¡Registro exitoso!</h2>
        )}
        <p className="text-center leading-tight sm:leading-normal text-sm">
          {!fromLogin
            ? "Tu correo está registrado pero aún no confirmado."
            : "Acabamos de enviarte un correo a "}
          <span className="font-medium">{email}</span>
          <br />
          Por favor revisa tu bandeja y haz clic en el enlace de verificación
          para activar tu cuenta antes de iniciar sesión.
        </p>
        {apiMsg && (
          <p className="mt-2 text-center text-sm text-green-600">{apiMsg}</p>
        )}
      </div>

      {/* Botones “Acceder” y “Reenviar correo…” */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="flex-1 py-3 bg-[#ca249c] cursor-pointer text-white font-semibold rounded-lg transition text-sm sm:text-base"
        >
          Acceder
        </button>
        <button
          onClick={handleResend}
          disabled={isBlocked}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-semibold rounded-lg transition text-sm sm:text-base
            ${
              isBlocked
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-[#9530ab] text-white cursor-pointer"
            }`}
        >
          {isBlocked ? (
            <>
              <FaSyncAlt className="animate-spin" />
              Reenviar en {counter}s
            </>
          ) : (
            <>
              <FaSyncAlt />
              Reenviar correo de verificación
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VerificationEmailSent;
