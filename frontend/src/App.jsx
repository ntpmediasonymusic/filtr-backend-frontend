import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Genres from "./pages/Genres";
import Moods from "./pages/Moods";
import Quizzes from "./pages/Quizzes";
import Shows from "./pages/Shows";
import MainCategory from "./pages/MainCategory";
import Footer from "./components/ui/Footer";
import NavMenu from "./components/ui/navMenu/NavMenu";
import { PlaylistProvider } from "./context/PlaylistContext";
import { PageTitleProvider } from "./context/pageTitleContext";
import Trending from "./pages/Trending";
import Prizes from "./pages/Prizes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EditAccount from "./pages/EditAccount";
import { SearchProvider } from "./context/SearchContext";
import FavoritePlaylists from "./pages/FavoritePlaylists";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131517]">
      <NavMenu />
      <div className="flex-1 mt-[50px] md:mt-[100px]">
        <SearchProvider>
          <PageTitleProvider>
            <PlaylistProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/moods" element={<Moods />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/shows" element={<Shows />} />
                <Route path="/main-category" element={<MainCategory />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/prizes" element={<Prizes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/edit-account" element={<EditAccount />} />
                <Route
                  path="/favorite-playlists"
                  element={<FavoritePlaylists />}
                />
              </Routes>
            </PlaylistProvider>
          </PageTitleProvider>
        </SearchProvider>
      </div>
      <Footer />
    </div>
  );
}

export default App;
