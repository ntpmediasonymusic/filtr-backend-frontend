import { createBrowserRouter } from "react-router-dom";
import RegionLayout from "./RegionLayout";
import Home from "../pages/Home";
import Genres from "../pages/Genres";
import Moods from "../pages/Moods";
import Quizzes from "../pages/Quizzes";
import Shows from "../pages/Shows";
import Trending from "../pages/Trending";
import Prizes from "../pages/Prizes";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import EditAccount from "../pages/EditAccount";
import FavoritePlaylists from "../pages/FavoritePlaylists";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import { RegionlessRedirect, RootRedirect } from "./RegionlessRedirect";

export const REGIONS = ["cr", "do", "pa"];

export const router = createBrowserRouter([
  // 1) raíz siempre a /cr
  { path: "/", element: <RootRedirect /> },

  // 2) rutas agrupadas por región
  {
    path: "/:region",
    element: <RegionLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "genres", element: <Genres /> },
      { path: "moods", element: <Moods /> },
      { path: "quizzes", element: <Quizzes /> },
      { path: "shows", element: <Shows /> },
      { path: "trending", element: <Trending /> },
      { path: "prizes", element: <Prizes /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "edit-account", element: <EditAccount /> },
      { path: "favorite-playlists", element: <FavoritePlaylists /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
    ],
  },

  // 3) fallback a /cr
  { path: "*", element: <RegionlessRedirect /> },
]);
