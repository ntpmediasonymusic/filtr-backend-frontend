import { useState } from "react";
import UserIcon from "../../../assets/icons/UserIcon";
import { MdOutlinePlace } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { TbPhone } from "react-icons/tb";
import { PiMusicNotes } from "react-icons/pi";
import { FaSpotify } from "react-icons/fa";
import { register, spotifyLogin } from "../../../api/backendApi";
import VerificationEmailSent from "./VerificationEmailSent";
import ClipLoader from "react-spinners/ClipLoader";
import RegionLink from "../../../router/RegionLink";
import { useRegion } from "../../../router/RegionContext";
import PartialSignUpForm from "./PartialSignUpForm";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../../../context/PlaylistContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { refreshPlaylists } = usePlaylists();
  const { region } = useRegion();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(
    region === "cr"
      ? "Costa Rica"
      : region === "do"
      ? "República Dominicana"
      : region === "pa"
      ? "Panamá"
      : ""
  );
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [listening, setListening] = useState("");
  const [optInSony, setOptInSony] = useState(false);
  const [optInFiltr, setOptInFiltr] = useState(false);
  const [checkboxPrivacyPolicy, setCheckboxPrivacyPolicy] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Control del flujo: primera etapa (email + password) -> formulario completo
  const [showFullForm, setShowFullForm] = useState(false);

  // Para validaciones campo a campo
  const [errors, setErrors] = useState({});
  // Para mostrar mensajes genéricos del backend (400, “correo ya registrado”, etc.)
  const [apiError, setApiError] = useState("");

  // Estado para “Verifica tu correo”
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [searchParams] = useSearchParams();
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [isSpotifyFlow, setIsSpotifyFlow] = useState(false);

  const countries = [
    "Afganistán",
    "Albania",
    "Alemania",
    "Andorra",
    "Angola",
    "Antigua y Barbuda",
    "Arabia Saudita",
    "Argelia",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaiyán",
    "Bahamas",
    "Baréin",
    "Bangladés",
    "Barbados",
    "Bélgica",
    "Belice",
    "Benín",
    "Bielorrusia",
    "Birmania (Myanmar)",
    "Bolivia",
    "Bosnia y Herzegovina",
    "Botsuana",
    "Brasil",
    "Brunéi",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Bután",
    "Cabo Verde",
    "Camboya",
    "Camerún",
    "Canadá",
    "Catar",
    "Chad",
    "Chile",
    "China",
    "Chipre",
    "Colombia",
    "Comoras",
    "Corea del Norte",
    "Corea del Sur",
    "Costa de Marfil",
    "Costa Rica",
    "Croacia",
    "Cuba",
    "Dinamarca",
    "Dominica",
    "Ecuador",
    "Egipto",
    "El Salvador",
    "Emiratos Árabes Unidos",
    "Eritrea",
    "Eslovaquia",
    "Eslovenia",
    "España",
    "Estados Unidos",
    "Estonia",
    "Esuatini",
    "Etiopía",
    "Filipinas",
    "Finlandia",
    "Fiyi",
    "Francia",
    "Gabón",
    "Gambia",
    "Georgia",
    "Ghana",
    "Granada",
    "Grecia",
    "Guatemala",
    "Guyana",
    "Guinea",
    "Guinea-Bisáu",
    "Guinea Ecuatorial",
    "Haití",
    "Honduras",
    "Hungría",
    "India",
    "Indonesia",
    "Irak",
    "Irán",
    "Irlanda",
    "Islandia",
    "Islas Marshall",
    "Islas Salomón",
    "Israel",
    "Italia",
    "Jamaica",
    "Japón",
    "Jordania",
    "Kazajistán",
    "Kenia",
    "Kirguistán",
    "Kiribati",
    "Kuwait",
    "Laos",
    "Lesoto",
    "Letonia",
    "Líbano",
    "Liberia",
    "Libia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "Macedonia del Norte",
    "Madagascar",
    "Malasia",
    "Malaui",
    "Maldivas",
    "Malí",
    "Malta",
    "Marruecos",
    "Mauricio",
    "Mauritania",
    "México",
    "Micronesia",
    "Moldavia",
    "Mónaco",
    "Mongolia",
    "Montenegro",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Nicaragua",
    "Níger",
    "Nigeria",
    "Noruega",
    "Nueva Zelanda",
    "Omán",
    "Países Bajos",
    "Pakistán",
    "Palaos",
    "Panamá",
    "Papúa Nueva Guinea",
    "Paraguay",
    "Perú",
    "Polonia",
    "Portugal",
    "Reino Unido",
    "República Centroafricana",
    "República Checa",
    "República del Congo",
    "República Democrática del Congo",
    "República Dominicana",
    "Ruanda",
    "Rumanía",
    "Rusia",
    "Samoa",
    "San Cristóbal y Nieves",
    "San Marino",
    "San Vicente y las Granadinas",
    "Santa Lucía",
    "Santo Tomé y Príncipe",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leona",
    "Singapur",
    "Siria",
    "Somalia",
    "Sri Lanka",
    "Sudáfrica",
    "Sudán",
    "Sudán del Sur",
    "Suecia",
    "Suiza",
    "Surinam",
    "Tailandia",
    "Tanzania",
    "Tayikistán",
    "Timor Oriental",
    "Togo",
    "Tonga",
    "Trinidad y Tobago",
    "Túnez",
    "Turkmenistán",
    "Turquía",
    "Tuvalu",
    "Ucrania",
    "Uganda",
    "Uruguay",
    "Uzbekistán",
    "Vanuatu",
    "Vaticano (Santa Sede)",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Yibuti",
    "Zambia",
    "Zimbabue",
    "Estado de Palestina",
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

  useEffect(() => {
    const token = searchParams.get("spotifyToken");
    if (token) {
      setSpotifyToken(token);
      setIsSpotifyFlow(true);
      setShowFullForm(true); // mostrar directamente el formulario completo

      try {
        // Decodificar payload del JWT temporal (solo para extraer email)
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.email) setEmail(payload.email);
      } catch (err) {
        console.error("Error decodificando spotifyToken:", err);
      }
    }
  }, [searchParams]);

  // Validación sólo de email y password (para el primer paso)
  const validateEmailAndPassword = () => {
    const errs = {};

    // Siempre validamos email
    if (!email) errs.email = "El correo es obligatorio.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      errs.email = "El correo no es válido.";

    // Solo validamos contraseña en flujo normal (NO Spotify)
    if (!isSpotifyFlow) {
      if (!password) errs.password = "La contraseña es obligatoria.";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}/.test(password))
        errs.password =
          "La contraseña requiere ≥6 caracteres, mayúsculas, minúsculas, números y símbolos.";
    }

    return errs;
  };

  // Validación completa para el submit final
  const validateFullForm = () => {
    const errs = validateEmailAndPassword();

    if (!firstName.trim()) errs.firstName = "El nombre es obligatorio.";
    if (!lastName.trim()) errs.lastName = "Los apellidos son obligatorios.";
    if (!country) errs.country = "Seleccione un país.";
    if (!birthdate) errs.birthdate = "La fecha de nacimiento es obligatoria.";

    if (!phone) errs.phone = "El teléfono es obligatorio.";
    else if (!/^\d+$/.test(phone)) errs.phone = "Sólo números permitidos.";
    else if (phone.length < 8)
      errs.phone = "El teléfono debe tener al menos 8 dígitos.";
    else if (phone.length > 11)
      errs.phone = "El teléfono debe tener máximo 11 dígitos.";

    if (!listening) errs.listening = "Seleccione una opción.";
    if (!checkboxPrivacyPolicy)
      errs.checkboxPrivacyPolicy = "Debes aceptar la política de privacidad.";

    return errs;
  };

  // Primer paso: validar email + password y mostrar el resto del formulario
  const handleContinuePartial = () => {
    setErrors({});
    setApiError("");

    const partialErrs = validateEmailAndPassword();
    if (Object.keys(partialErrs).length) {
      setErrors(partialErrs);
      return;
    }

    setShowFullForm(true);
  };

  // Placeholder para el futuro flujo de Spotify
  const handleContinueWithSpotify = () => {
    spotifyLogin();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setApiError("");

  // Si aún no se ha completado el primer paso y el usuario dispara un submit (Enter),
  // nos comportamos como si hubiera presionado "CONTINUAR".
  if (!showFullForm) {
    const partialErrs = validateEmailAndPassword();
    if (Object.keys(partialErrs).length) {
      setErrors(partialErrs);
      return;
    }
    setShowFullForm(true);
    return;
  }

  const errs = validateFullForm();
  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  const payload = {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth: birthdate,
    phone,
    country,
    favoriteMethod: listening,
    optInSony,
    optInFiltr,
  };

  setIsLoading(true);

  try {
    // Si venimos del flujo Spotify, mandamos también el spotifyToken
    if (spotifyToken) {
      payload.spotifyToken = spotifyToken;
      payload.email = email; // por claridad, el correo que se está usando
      // y opcionalmente puedes eliminar password si no lo usas en el back:
      delete payload.password;
    }

    const response = await register(payload);
    const { status, data } = response;

    // 🔹 CASO 1: Flujo Spotify → el back ya inició sesión
    // { message: "Cuenta completada y sesión iniciada", token, user }
    if (spotifyToken && data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // refrescar playlists como en LoginForm
      try {
        await refreshPlaylists();
      } catch (err) {
        console.error(
          "Error refrescando playlists después de Spotify signup:",
          err
        );
      }

      // Redirigir al home (o a donde quieras)
      navigate("/");
      return;
    }

    // 🔹 CASO 2: Registro normal con correo/contraseña → pedir verificación
    if (status === 201 && data.message?.includes("revisa tu correo")) {
      setRegisteredEmail(email);
      setShowVerifyNotice(true);
      return;
    }

    // Si por alguna razón no cae en ninguno de los dos casos
    console.warn("Respuesta de /auth/register no esperada:", data);
  } catch (err) {
    if (err.response?.status === 400 && err.response.data.errors) {
      const apiErrs = {};
      err.response.data.errors.forEach((e) => {
        apiErrs[e.param] = e.msg;
      });
      setErrors(apiErrs);
    } else if (err.response?.status === 400 && err.response.data.message) {
      setApiError(err.response.data.message);
    } else {
      console.error("Error en registro:", err);
      setApiError("Ocurrió un error inesperado. Intenta de nuevo.");
    }
  } finally {
    setIsLoading(false);
  }
};

  // Si ya hemos registrado y el back nos pidió verificar, mostramos el aviso:
  if (showVerifyNotice) {
    return <VerificationEmailSent email={registeredEmail} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white
                 p-5 sm:p-[40px] rounded-[22px] max-w-[800px] w-full
                 mx-auto flex flex-col gap-4 sm:gap-5"
    >
      {/* Paso 1: email + password + CONTINUAR + Spotify
        Solo se muestra cuando showFullForm es false */}
      {!showFullForm && !isSpotifyFlow && (
        <>
          <PartialSignUpForm
            email={email}
            password={password}
            showPwd={showPwd}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onToggleShowPwd={() => setShowPwd((v) => !v)}
            onContinue={handleContinuePartial}
            errors={errors}
          />

          {/* Divider + botón CONTINUAR CON SPOTIFY */}
          <div className="my-4">
            <div className="h-[1px] w-full bg-[#ca249c]" />
          </div>

          <button
            type="button"
            onClick={handleContinueWithSpotify}
            className="w-full flex col justify-center items-center gap-2 sm:gap-3 py-2.5 sm:py-3 bg-[#1DB954] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base cursor-pointer"
          >
            <FaSpotify className="text-[#ffffff] w-5 h-5 sm:w-6.5 sm:h-6.5 flex-shrink-0" />
            CONTINUAR CON SPOTIFY
          </button>
        </>
      )}

      {/* Resto del formulario (solo cuando email y password ya se validaron) */}
      {showFullForm && (
        <>
          {/* Nombre y Apellidos */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
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
                  <LiaBirthdayCakeSolid className="text-[#ca249c] w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
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

          {/* Opt-in Sony / Filtr y Política de privacidad */}
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
            <div className="w-full">
              <label className="flex items-start sm:items-center gap-2 text-xs sm:text-base">
                <input
                  type="checkbox"
                  checked={checkboxPrivacyPolicy}
                  onChange={() => setCheckboxPrivacyPolicy((v) => !v)}
                  className="w-4 h-4 accent-[#ca249c] mt-0.5 sm:mt-0 flex-shrink-0"
                />
                <span className="leading-tight sm:leading-normal">
                  He leído y acepto la{" "}
                  <a
                    href="https://sonymusic.co.cr/politica-de-privacidad/"
                    target="_blank"
                    className="font-semibold underline underline-offset-2 text-[#ca249c] text-sm sm:text-base"
                  >
                    Política de Privacidad de Sony Music Centroamérica
                  </a>
                  .
                </span>
              </label>
              {errors.checkboxPrivacyPolicy && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.checkboxPrivacyPolicy}
                </p>
              )}
            </div>
          </div>

          {/* Mensaje genérico de error del backend, si existe */}
          {apiError && (
            <p className="text-center text-red-600 font-bold text-sm">
              {apiError}
            </p>
          )}

          {/* Botón CREAR CUENTA + link Política de Privacidad */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 bg-[#ca249c] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base cursor-pointer"
            >
              {isLoading ? (
                <ClipLoader size={16} color="#FFFFFF" />
              ) : (
                "CREAR CUENTA"
              )}
            </button>
            <a
              href="https://sonymusic.co.cr/politica-de-privacidad/"
              target="_blank"
              className="font-semibold underline underline-offset-2 text-[#ca249c] text-sm sm:text-base text-center"
            >
              Política de Privacidad de Sony Music Centroamérica
            </a>
          </div>
        </>
      )}

      {/* Link “Ya soy miembro FILTR / Iniciar sesión” – siempre al final */}
      <div className="text-center text-[#131517] mt-4 sm:mt-5">
        <span className="text-sm sm:text-base">Ya soy miembro FILTR</span>
        <br />
        <RegionLink
          to="/login"
          className="font-semibold underline underline-offset-2 text-[#131517] text-sm sm:text-base"
        >
          Iniciar sesión
        </RegionLink>
      </div>
    </form>
  );
};

export default SignUpForm;