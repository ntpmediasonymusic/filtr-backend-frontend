import { useEffect } from "react";
import LoginForm from "../components/ui/forms/LoginForm";

const Login = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-[50px] md:py-[50px]">
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-white text-2xl md:text-3xl font-bold">
          Disfruta de la mejor música y contenidos exclusivos
        </h2>
        <p className="text-[#CFDD28] text-lg font-semibold mt-2">¡Entra ya!</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;