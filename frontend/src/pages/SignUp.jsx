import { useEffect } from "react";
import SignUpForm from "../components/ui/forms/SignUpForm";

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-[50px] md:py-[50px]">
      <div className="flex flex-col text-center mb-8 max-w-md gap-3">
        <h2 className="text-white text-2xl md:text-3xl font-bold">
          SOMOS FILTR
        </h2>
        <p className="text-white/90">
          Únete a una comunidad de apasionados por la música. <br />
          Descubre playlists para todo momento y vive experiencias exclusivas.
        </p>
        <p className="text-[#CFDD28] font-semibold"> ¡Regístrate ahora!</p>
      </div>

      {/* Formulario */}
      <SignUpForm />
    </div>
  );
};

export default SignUp;
