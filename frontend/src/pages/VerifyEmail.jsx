import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmEmail } from "../api/backendApi";
import EnvelopeIcon from "../assets/icons/EnvelopeIcon";

const VerifyEmail = () => {
  const calledRef = useRef(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (calledRef.current) return;
    calledRef.current = true;

    if (!token) {
      setStatus("error");
      setMessage("Falta el token de verificación.");
      return;
    }

    confirmEmail(token)
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        const statusCode = err.response?.status;
        const errMsg =
          err.response?.data?.message || "Error validando el enlace.";

        // Si ya estaba verificado, lo tratamos como success
        if (statusCode === 400 && errMsg.includes("ya está verificada")) {
          setStatus("success");
          setMessage("Tu cuenta ya estaba verificada. Puedes iniciar sesión.");
        } else {
          setStatus("error");
          setMessage(errMsg);
        }
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-[50px] md:py-[50px]">
      <div className="flex flex-col text-center mb-8 max-w-md gap-2">
        <h2 className="text-white text-2xl md:text-3xl font-bold">
          SOMOS FILTR
        </h2>
        <p className="text-white/90 font-bold">
          Una comunidad de apasionados por la música
        </p>
        <p className="text-[#CFDD28] font-semibold ">¡Entra ya!</p>
      </div>

      <div
        className="bg-white
                   p-5 sm:p-[40px] rounded-[22px] max-w-[800px] w-full
                   mx-auto flex flex-col gap-4 sm:gap-5"
      >
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center bg-[#ca249c] rounded-full">
            <EnvelopeIcon className="text-white w-12 h-12" />
          </div>

          {status === "loading" && (
            <p className="text-lg text-center">Validando enlace…</p>
          )}

          {status === "success" && (
            <>
              <h2 className="text-2xl font-bold text-center">
                ¡Correo verificado!
              </h2>
              <p className="text-center">{message}</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 py-2 px-6 bg-[#ca249c] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                ACCEDER A FILTR
              </button>
            </>
          )}
        </div>

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-center text-red-600">
              Oops…
            </h2>
            <p className="text-center text-red-600">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 py-2 px-6 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:opacity-90 transition"
            >
              VOLVER AL INICIO
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
