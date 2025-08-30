import { createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { REGIONS } from "../utils/region";

const PageTitleContext = createContext();

// Normaliza rutas tipo "/cr/moods" -> "/moods" y "/cr" -> "/"
function normalizePathname(pathname) {
  const parts = pathname.split("/").filter(Boolean); // ["cr","moods"] o ["cr"]
  if (parts.length === 0) return "/";               // "/"
  if (REGIONS.includes(parts[0])) {
    if (parts.length === 1) return "/";             // "/cr" -> "/"
    return "/" + parts.slice(1).join("/");          // "/cr/moods" -> "/moods"
  }
  return pathname;                                  
}

// eslint-disable-next-line react/prop-types
export const PageTitleProvider = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const path = normalizePathname(location.pathname);

    const titles = {
      "/": "Filtr",
      "/genres": "Géneros",
      "/moods": "Moods",
      "/quizzes": "Quizzes",
      "/shows": "Shows",
      "/trending": "Trending",
      "/prizes": "Premios",
      "/login": "Acceder",
      "/signup": "Registrarse",
      "/edit-account": "Editar perfil",
      "/favorite-playlists": "Mis Playlist favoritas",
      "/verify-email": "Verificar correo",
      "/forgot-password": "Recuperar contraseña",
      "/reset-password": "Recuperar contraseña",
      "/terms-and-conditions": "Términos y Condiciones",
      "/privacy-policy": "Política de Privacidad",
    };

    const base = titles[path] ?? "Filtr";
    document.title = base === "Filtr" ? base : `${base} | Filtr`;

  }, [location.pathname]);

  return (
    <PageTitleContext.Provider value={null}>
      {children}
    </PageTitleContext.Provider>
  );
};

export default PageTitleContext;