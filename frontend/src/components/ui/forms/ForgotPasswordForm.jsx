import { useState } from "react";
import { forgotPassword } from "../../../api/backendApi";
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";
import ForgotEmailSent from "./ForgotEmailSent";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showSent, setShowSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = "El e-mail es obligatorio.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errs.email = "El e-mail no es válido.";
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

    try {
      await forgotPassword(email);
      setShowSent(true);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Error enviando correo.";
      if (status === 400) {
        setApiError(msg);
      } else {
        setApiError("Ocurrió un error. Intenta de nuevo.");
        console.error(err);
      }
    }
  };

  if (showSent) {
    return <ForgotEmailSent />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-10 rounded-[22px] max-w-[800px] w-full mx-auto flex flex-col gap-4 sm:gap-5"
    >
      <h2 className="text-center text-2xl font-bold">
        ¿Olvidaste tu contraseña?
      </h2>
      <p className="text-center leading-tight sm:leading-normal text-sm">
        Ingresa tu correo electrónico y espera un enlace seguro para restablecer
        tu contraseña.
      </p>

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

      {/* Error backend */}
      {apiError && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-600 font-bold text-center">
            {apiError}
          </p>
        </div>
      )}

      {/* Enviar */}
      <button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-[#ca249c] cursor-pointer text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base"
      >
        ENVIAR
      </button>

      {/* Link a signup */}
      <div className="text-center text-[#131517] mt-1 sm:mt-2 text-sm sm:text-base">
        ¿Aún no eres miembro FILTR?
        <br />
        <a href="/signup" className="underline font-semibold">
          Regístrate aquí
        </a>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
