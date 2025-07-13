import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Genres from "./pages/Genres";
import Moods from "./pages/Moods";
import Quizzes from "./pages/Quizzes";
import Shows from "./pages/Shows";
import Footer from "./components/ui/Footer";
import NavMenu from "./components/ui/navMenu/NavMenu";
import { PlaylistProvider } from "./context/PlaylistContext";
import { PageTitleProvider } from "./context/pageTitleContext";
import { SearchProvider } from "./context/SearchContext";
import Trending from "./pages/Trending";
import Prizes from "./pages/Prizes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EditAccount from "./pages/EditAccount";
import FavoritePlaylists from "./pages/FavoritePlaylists";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CookieConsentBanner from "./components/ui/modal/CookieConsentBanner";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131517]">
      <CookieConsentBanner />
      <SearchProvider>
        <NavMenu />
        <div className="flex-1 mt-[50px] md:mt-[80px]">
          <PageTitleProvider>
            <PlaylistProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/moods" element={<Moods />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/shows" element={<Shows />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/prizes" element={<Prizes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/edit-account" element={<EditAccount />} />
                <Route
                  path="/favorite-playlists"
                  element={<FavoritePlaylists />}
                />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/terms-and-conditions"
                  element={<TermsAndConditions />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              </Routes>
            </PlaylistProvider>
          </PageTitleProvider>
        </div>
      </SearchProvider>
      <Footer />
    </div>
  );
}

export default App;
