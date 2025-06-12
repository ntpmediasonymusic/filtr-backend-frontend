import { useEffect } from "react";
import SignUpForm from "../components/ui/forms/SignUpForm";

const SignUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-[50px] md:py-[50px]">
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-white text-2xl md:text-3xl font-bold">
          Vamos a registrarte
        </h2>
        <p className="text-white/80 mt-2">
          Crea tu cuenta y disfruta de contenidos exclusivos
        </p>
        <p className="text-[#CFDD28] font-semibold">¡Únete ahora!</p>
      </div>

      {/* Formulario */}
      <SignUpForm />
    </div>
  );
};

export default SignUp;
