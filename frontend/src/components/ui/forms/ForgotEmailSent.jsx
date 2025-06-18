import { useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import EnvelopeIcon from "../../../assets/icons/EnvelopeIcon";

const ForgotEmailSent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

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
        <h2 className="text-center text-2xl font-bold">¡Correo enviado!</h2>

        <p className="text-center leading-tight sm:leading-normal text-sm">
          Revisa tu bandeja de entrada con los pasos para restablecer tu
          contraseña.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="flex-1 py-3 bg-[#ca249c] cursor-pointer text-white font-semibold rounded-lg transition text-sm sm:text-base"
        >
          ACCEDER
        </button>
      </div>
    </div>
  );
};

export default ForgotEmailSent;
