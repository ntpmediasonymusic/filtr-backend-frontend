import { createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitleContext = createContext();

// eslint-disable-next-line react/prop-types
export const PageTitleProvider = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Filtr";
        break;
      case "/explore":
        document.title = "Explorar";
        break;
      case "/genres":
        document.title = "Géneros";
        break;
      case "/moods":
        document.title = "Moods";
        break;
      case "/quizzes":
        document.title = "Quizzes";
        break;
      case "/shows":
        document.title = "Shows";
        break;
      case "/main-category":
        document.title = "Categoría";
        break;
      case "/trending":
        document.title = "Trending";
        break;
      case "/prizes":
        document.title = "Premios";
        break;
      case "/login":
        document.title = "Login";
        break;
      case "/signup":
        document.title = "SignUp";
        break;
      case "/edit-account":
        document.title = "Editar perfil";
        break;
      case "/favorite-playlists":
        document.title = "Mis Playlist favoritas";
        break;
      case "/verify-email":
        document.title = "Verificar correo";
        break;
      case "/forgot-password":
        document.title = "Recuperar contraseña";
        break;
      case "/reset-password":
        document.title = "Recuperar contraseña";
        break;
      default:
        document.title = "Filtr";
    }
  }, [location]);

  return (
    <PageTitleContext.Provider value={null}>
      {children}
    </PageTitleContext.Provider>
  );
};
