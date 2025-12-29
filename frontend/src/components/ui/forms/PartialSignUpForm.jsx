/* eslint-disable react/prop-types */
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";
import LockIcon from "../../../assets/icons/LockIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PartialSignUpForm = ({
  email, 
  password,
  showPwd,
  onChangeEmail,
  onChangePassword,
  onToggleShowPwd,
  onContinue,
  errors = {},
}) => {
  return (
    <>
      {/* E-mail */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
            <EnvelopeIcon className="text-[#ca249c]" />
          </div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="w-full">
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
            <LockIcon className="text-[#ca249c]" />
          </div>
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={onToggleShowPwd}
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

      {/* Botón CONTINUAR (solo valida email + password y abre el resto del formulario) */}
      <div className="flex flex-col gap-1 sm:gap-2 mt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-2.5 sm:py-3 bg-[#ca249c] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base"
        >
          CONTINUAR
        </button>
      </div>
    </>
  );
};

export default PartialSignUpForm;
