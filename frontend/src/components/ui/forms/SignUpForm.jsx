import { useState } from "react";
import UserIcon from "../../../assets/icons/UserIcon";
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";
import LockIcon from "../../../assets/icons/LockIcon";
import { FaRegCalendarAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlinePlace } from "react-icons/md";
import { TbPhone } from "react-icons/tb";
import { PiMusicNotes } from "react-icons/pi";
import { register } from "../../../api/backendApi";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [listening, setListening] = useState("");
  const [optInSony, setOptInSony] = useState(true);
  const [optInFiltr, setOptInFiltr] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  const countries = [
    "Costa Rica",
    "Panamá",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Belice",
    "República Dominicana",
    "México",
    "Colombia",
  ];
  const listeningOptions = [
    "Spotify Premium",
    "Spotify Free",
    "YouTube Premium",
    "YouTube Free",
    "YouTube Music Premium",
    "YouTube Music Free",
    "Apple Music",
    "Otro",
  ];

  const validate = () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = "El nombre es obligatorio.";
    if (!lastName.trim()) errs.lastName = "Los apellidos son obligatorios.";
    if (!email) errs.email = "El correo es obligatorio.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errs.email = "El correo no es válido.";
    if (!password) errs.password = "La contraseña es obligatoria.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}/.test(password))
      errs.password =
        "La contraseña requiere ≥6 caracteres, mayúsculas, minúsculas, números y símbolos.";
    if (!country) errs.country = "Seleccione un país.";
    if (!birthdate) errs.birthdate = "La fecha de nacimiento es obligatoria.";
    if (!phone) errs.phone = "El teléfono es obligatorio.";
    else if (!/^\d+$/.test(phone)) errs.phone = "Sólo números permitidos.";
    if (!listening) errs.listening = "Seleccione una opción.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth: birthdate,
      phone,
      country: country,
      favoriteMethod: listening,
      optInSony,
      optInFiltr,
    };

    try {
      const { data } = await register(payload);
      // almacena token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // redirige directo
      navigate("/");
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.errors) {
        const apiErrs = {};
        err.response.data.errors.forEach((e) => {
          apiErrs[e.param] = e.msg;
        });
        setErrors(apiErrs);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white
                 p-5 sm:p-[40px] rounded-[22px] max-w-[800px] w-full
                 mx-auto flex flex-col gap-4 sm:gap-5"
    >
      {/* Nombre y Apellidos */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Nombre */}
        <div className="w-full sm:w-1/2">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
              <UserIcon className="text-[#ca249c]" />
            </div>
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.firstName}
            </p>
          )}
        </div>
        {/* Apellidos */}
        <div className="w-full sm:w-1/2">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
              <UserIcon className="text-[#ca249c]" />
            </div>
            <input
              type="text"
              placeholder="Apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

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
        <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
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
            onClick={() => setShowPwd((v) => !v)}
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

      {/* País y Fecha de nacimiento */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* País */}
        <div className="w-full sm:w-1/2">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
              <MdOutlinePlace className="text-[#ca249c] w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 text-sm sm:text-base"
            >
              <option value="">País</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {errors.country && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.country}
            </p>
          )}
        </div>
        {/* Fecha de nacimiento */}
        <div className="w-full sm:w-1/2">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
              <FaRegCalendarAlt className="text-[#ca249c] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </div>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
            />
          </div>
          {errors.birthdate && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.birthdate}
            </p>
          )}
        </div>
      </div>

      {/* Teléfono y Forma de escuchar música */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Teléfono */}
        <div className="w-full sm:w-1/2">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
              <TbPhone className="text-[#ca249c] w-5 h-5 sm:w-6.5 sm:h-6.5 flex-shrink-0" />
            </div>
            <input
              type="tel"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>
        {/* Forma de escuchar música */}
        <div className="w-full sm:w-1/2">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex justify-center items-center">
              <PiMusicNotes className="text-[#ca249c] w-5 h-5 sm:w-6.5 sm:h-6.5 flex-shrink-0" />
            </div>
            <select
              value={listening}
              onChange={(e) => setListening(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-gray-700 text-sm sm:text-base"
            >
              <option value="">¿Cómo escuchas música?</option>
              {listeningOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          {errors.listening && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.listening}
            </p>
          )}
        </div>
      </div>

      {/* Opt-in Sony / Filtr */}
      <div className="flex flex-col gap-3 sm:gap-2 text-black">
        <label className="flex items-start sm:items-center gap-2 text-xs sm:text-base">
          <input
            type="checkbox"
            checked={optInSony}
            onChange={() => setOptInSony((v) => !v)}
            className="w-4 h-4 accent-[#ca249c] mt-0.5 sm:mt-0 flex-shrink-0"
          />
          <span className="leading-tight sm:leading-normal">
            Me gustaría suscribirme y recibir más información de Sony Music
            Centroamérica y El Caribe.
          </span>
        </label>
        <label className="flex items-start sm:items-center gap-2 text-xs sm:text-base">
          <input
            type="checkbox"
            checked={optInFiltr}
            onChange={() => setOptInFiltr((v) => !v)}
            className="w-4 h-4 accent-[#ca249c] mt-0.5 sm:mt-0 flex-shrink-0"
          />
          <span className="leading-tight sm:leading-normal">
            Me gustaría suscribirme y recibir más información de Filtr
            Centroamérica y El Caribe.
          </span>
        </label>
      </div>

      {/* Botón Principal */}
      <button
        type="submit"
        className="w-full py-2.5 sm:py-3 mt-3 sm:mt-6 bg-[#ca249c] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base"
      >
        Crear cuenta
      </button>

      {/* Link Sign Up */}
      <div className="text-center text-[#131517] mt-1 sm:mt-2">
        <span className="text-sm sm:text-base">¿Ya tienes una cuenta?</span>
        <br />
        <a
          href="/login"
          className="font-semibold text-[#131517] text-sm sm:text-base"
        >
          Accede Aquí
        </a>
      </div>
    </form>
  );
};

export default SignUpForm;
