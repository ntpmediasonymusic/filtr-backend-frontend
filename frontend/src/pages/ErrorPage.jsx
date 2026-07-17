import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  if (import.meta.env.DEV) {
    console.error("Route error boundary:", error);
  }

  const message = isRouteErrorResponse(error)
    ? error.statusText || `Error ${error.status}`
    : error?.message;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-[#131517]">
      <h1 className="text-white text-2xl md:text-3xl font-bold">
        Algo salió mal
      </h1>
      <p className="text-white/80 max-w-md">
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      {message && (
        <p className="text-white/40 text-xs max-w-md break-words">{message}</p>
      )}
      <button
        onClick={() => navigate("/")}
        className="mt-2 py-2.5 px-6 bg-[#ca249c] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base cursor-pointer"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default ErrorPage;
