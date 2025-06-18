/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { updateProfile, deleteAccount } from "../../../api/backendApi";
import UserIcon from "../../../assets/icons/UserIcon";
import LockIcon from "../../../assets/icons/LockIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlinePlace } from "react-icons/md";
import { TbPhone } from "react-icons/tb";
import { PiMusicNotes } from "react-icons/pi";
import DeleteAccountModal from "../../ui/modal/DeleteAccountModal";
import { useNavigate } from "react-router-dom";

export default function EditAccountForm({ user, setUser }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [country, setCountry] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [listening, setListening] = useState("");
  const [optInSony, setOptInSony] = useState(false);
  const [optInFiltr, setOptInFiltr] = useState(false);
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "success"|"error"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionMsg, setDeletionMsg] = useState("");

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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setCountry(user.country || "");
      setBirthdate(user.dateOfBirth || "");
      setPhone(user.phone || "");
      setListening(user.favoriteMethod || "");
      setOptInSony(user.optInSony);
      setOptInFiltr(user.optInFiltr);
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (currentPassword || newPassword) {
      if (!currentPassword)
        errs.currentPassword = "Confirma tu contraseña actual.";
      if (!newPassword) errs.newPassword = "Ingresa tu nueva contraseña.";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}/.test(newPassword))
        errs.newPassword =
          "Mínimo 6 caracteres, mayúsculas, minúsculas, números y símbolos.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {};
    if (firstName !== user.firstName) payload.firstName = firstName;
    if (lastName !== user.lastName) payload.lastName = lastName;
    if (country !== user.country) payload.country = country;
    if (birthdate !== user.dateOfBirth) payload.dateOfBirth = birthdate;
    if (phone !== user.phone) payload.phone = phone;
    if (listening !== user.favoriteMethod) payload.favoriteMethod = listening;
    if (optInSony !== user.optInSony) payload.optInSony = optInSony;
    if (optInFiltr !== user.optInFiltr) payload.optInFiltr = optInFiltr;
    if (currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setMessage("No hay cambios para guardar.");
      setMsgType("error");
      return;
    }

    try {
      const resp = await updateProfile(user.id, payload);
      setMessage(resp.data.message);
      setMsgType("success");
      const updated = { ...user, ...resp.data.user };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al guardar cambios.");
      setMsgType("error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(user.id);
      setDeletionMsg("Tu cuenta ha sido eliminada.");
      // cerrar modal
      setShowDeleteModal(false);
      // esperar 5 segundos antes de limpiar
      setTimeout(() => {
        localStorage.clear();
        navigate("/");
      }, 1000);
    } catch (err) {
      setDeletionMsg("Error al eliminar la cuenta.");
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-[40px] rounded-[22px] max-w-[800px] w-full mx-auto flex flex-col gap-4 sm:gap-5"
        autoComplete="off"
      >
        {/* Nombre y Apellidos */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
              <UserIcon className="text-[#ca249c] w-6 h-6" />
              <input
                type="text"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
              <UserIcon className="text-[#ca249c] w-6 h-6" />
              <input
                type="text"
                placeholder="Apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Contraseña actual */}
        <div className="w-full">
          {/* Instrucción cambio contraseña */}
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Para cambiar tu contraseña deberás de confirma tu contraseña actual.
          </p>
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <LockIcon className="text-[#ca249c] w-6 h-6" />
            <input
              type={showPwdCurrent ? "text" : "password"}
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPwdCurrent((v) => !v)}
              className="text-gray-600"
            >
              {showPwdCurrent ? (
                <FaEyeSlash className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-[#ca249c] transition-transform duration-200 ease-in-out" />
              ) : (
                <FaEye className="w-4 h-4 sm:w-5 sm:h-5 text-[#ca249c] transition-transform duration-200 ease-in-out" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div className="w-full">
          <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
            <LockIcon className="text-[#ca249c] w-6 h-6" />
            <input
              type={showPwdNew ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPwdNew((v) => !v)}
              className="text-gray-600"
            >
              {showPwdNew ? (
                <FaEyeSlash className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-[#ca249c] transition-transform duration-200 ease-in-out" />
              ) : (
                <FaEye className="w-4 h-4 sm:w-5 sm:h-5 text-[#ca249c] transition-transform duration-200 ease-in-out" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* País y Fecha de nacimiento */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
              <MdOutlinePlace className="text-[#ca249c] w-6 h-6" />
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
          </div>
          <div className="w-full sm:w-1/2">
            <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
              <LiaBirthdayCakeSolid className="text-[#ca249c] w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Teléfono y Forma de escuchar música */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
              <TbPhone className="text-[#ca249c] w-6 h-6" />
              <input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2">
              <PiMusicNotes className="text-[#ca249c] w-6 h-6" />
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
          </div>
        </div>

        {/* Opt-ins */}
        <div className="flex flex-col gap-2 sm:gap-1">
          <label className="flex items-center gap-2 text-sm sm:text-base">
            <input
              type="checkbox"
              checked={optInSony}
              onChange={() => setOptInSony((v) => !v)}
              className="w-4 h-4 accent-[#ca249c]"
            />
            Me gustaría suscribirme y recibir más información de Sony Music
            Centroamérica y El Caribe.
          </label>
          <label className="flex items-center gap-2 text-sm sm:text-base">
            <input
              type="checkbox"
              checked={optInFiltr}
              onChange={() => setOptInFiltr((v) => !v)}
              className="w-4 h-4 accent-[#ca249c]"
            />
            Me gustaría suscribirme y recibir más información de Filtr
            Centroamérica y El Caribe.
          </label>
        </div>

        {/* Mensaje resultado */}
        {message && (
          <p
            className={`text-lg text-center ${
              msgType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Guardar cambios */}
        <button
          type="submit"
          className="w-full py-3 bg-[#ca249c] text-white font-semibold rounded-lg transition hover:opacity-90 text-sm sm:text-base"
        >
          GUARDAR CAMBIOS
        </button>

        {/* Botón Eliminar mi cuenta */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="w-full mt-3 py-2 underline underline-offset-2 text-red-600 font-medium text-sm sm:text-sm"
        >
          ELIMINAR MI CUENTA
        </button>

        {/* Mensaje de eliminación */}
        {deletionMsg && (
          <p className="mt-2 text-center text-red-600 text-sm">{deletionMsg}</p>
        )}
      </form>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
