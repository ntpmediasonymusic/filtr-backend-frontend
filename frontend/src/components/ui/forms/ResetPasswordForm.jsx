import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../api/backendApi";
import LockIcon from "../../../assets/icons/LockIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import ClipLoader from "react-spinners/ClipLoader";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!password) {
      errs.password = "La contraseña es obligatoria.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}/.test(password)) {
      errs.password =
        "Mínimo 6 caracteres, mayúsculas, minúsculas, números y símbolos.";
    }
    if (!confirm) {
      errs.confirm = "Confirma tu nueva contraseña.";
    } else if (password && confirm !== password) {
      errs.confirm = "Las contraseñas no coinciden.";
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
      await resetPassword(token, password);
      setShowSuccess(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Ocurrió un error restableciendo la contraseña."
      );
    } finally {
      setIsLoading(false); 
    }
  };

  if (showSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-10 rounded-[22px] max-w-[800px] w-full mx-auto flex flex-col gap-4 sm:gap-5"
    >
      <h2 className="text-center text-2xl font-bold">
        Ingresa tu nueva contraseña
      </h2>
      <p className="text-center leading-tight sm:leading-normal text-sm">
        Debe contener un máximo de 6 caracteres incluyendo mayúsculas y números.
      </p>

      {/* Nueva contraseña */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2 sm:gap-3">
          <LockIcon className="text-[#ca249c] w-6 h-6 sm:w-8 sm:h-8" />
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Nueva contraseña"
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

      {/* Confirmar contraseña */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2 sm:gap-3">
          <LockIcon className="text-[#ca249c] w-6 h-6 sm:w-8 sm:h-8" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-gray-600"
          >
            {showConfirm ? (
              <FaEyeSlash className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-[#ca249c]" />
            ) : (
              <FaEye className="w-4 h-4 sm:w-5 sm:h-5 text-[#ca249c]" />
            )}
          </button>
        </div>
        {errors.confirm && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">
            {errors.confirm}
          </p>
        )}
      </div>

      {/* Error del servidor */}
      {apiError && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-red-600 font-bold text-center">
            {apiError}
          </p>
        </div>
      )}

      {/* Botón enviar */}
      <button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-[#ca249c] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base"
      >
        {isLoading ? (
          <ClipLoader size={16} color="#FFFFFF" />
        ) : (
          "CAMBIAR CONTRASEÑA"
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
