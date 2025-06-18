import { useEffect } from "react";
import LoginForm from "../components/ui/forms/LoginForm";

const Login = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-[50px] md:py-[50px]">
      <div className="flex flex-col text-center mb-8 max-w-md gap-2">
        <h2 className="text-white text-2xl md:text-3xl font-bold">
          SOMOS FILTRCA
        </h2>
        <p className="text-white/90 font-bold">
          Una comunidad de apasionados por la música
        </p>
        <p className="text-[#CFDD28] font-semibold ">¡Entra ya!</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;