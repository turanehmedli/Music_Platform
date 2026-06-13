import { Route, Routes, Navigate, useLocation } from "react-router";
import Homepage from "./pages/Homepage";
import DrawerBar from "./components/layout/DrawerBar";
import Discover from "./pages/Discover";
import NavBar from "./components/layout/NavBar";
import Favorite from "./pages/Favorite";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import MusicDetails from "./components/home/MusicDetails";
import { useTheme } from "./stores/themeStores";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResultsP from "./components/common/SearchResultsP";
import UserProfileP from "./components/home/UserProfileP";
import PageNotFound from "./components/common/PageNotFound";
import { useAuthStore } from "./stores/useAuthStore";
import TabBar from "./components/layout/TabBar";
import MiniPlayer from "./components/home/MiniPlayer";
import { X } from "lucide-react";
import { useTrackSheet } from "./stores/useTrackSheet";
import MusicDetailsContent from "./components/home/MusicDetailsContent";
import Playlist from "./pages/Playlist";
import PlaylistDetails from "./components/home/PlaylistDetails";
import Following from "./pages/Following";
import Help from "./pages/Help";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, hasHydrated } = useAuthStore();
  if (!hasHydrated) return <div>Loading...</div>;
  if (!accessToken) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App = () => {
  const { isDarkModeOn } = useTheme();
  const { accessToken, hasHydrated } = useAuthStore();
  const { isOpen, trackId, closeSheet } = useTrackSheet();
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="w-full min-h-screen flex relative">
      {/* Sol DrawerBar — sabit */}
      {accessToken && hasHydrated && (
        <div className="hidden xl:block fixed left-0 top-0 h-full w-[250px] z-30">
          <DrawerBar />
        </div>
      )}

      {/* Ana içerik alanı — sheet açılınca daralır */}
      <div
        className={`
          flex flex-col min-h-screen w-full ease-in-out duration-300
          ${!isAuthPage && "xl:pl-[240px]"}
          ${isOpen ? "xl:pr-[380px]" : ""}
          ${isDarkModeOn ? "bg-slate-900 text-amber-50" : "bg-gray-100"}
          sm:pb-10 pb-15
          select-none
        `}
      >
        {accessToken && hasHydrated && (
          <>
            <div className="w-full flex xl:hidden">
              <NavBar />
            </div>
            <div className="w-full flex sm:hidden">
              <TabBar />
            </div>
          </>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorite"
            element={
              <ProtectedRoute>
                <Favorite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/results"
            element={
              <ProtectedRoute>
                <SearchResultsP />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover/music/:id"
            element={
              <ProtectedRoute>
                <MusicDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserProfileP />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <ProtectedRoute>
                <PlaylistDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/following"
            element={
              <ProtectedRoute>
                <Following />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
        </Routes>

        {accessToken && hasHydrated && <MiniPlayer />}
      </div>

      {/* Sağ Panel — sadece desktop, backdrop yok, sayfa üstüne yapışık */}
      {isOpen && trackId && (
        <div
          className="hidden lg:flex flex-col fixed right-0 top-0 h-full w-[380px] z-30 overflow-y-auto border-l"
          style={{
            animation: "slideIn 0.3s cubic-bezier(.22,1,.36,1)",
            background: isDarkModeOn ? "#0f0f13" : "#ffffff",
            borderColor: isDarkModeOn
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
          }}
        >
          <button
            onClick={closeSheet}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition"
          >
            <X
              className={`size-4 ${isDarkModeOn ? "text-white" : "text-black"}`}
            />
          </button>
          <MusicDetailsContent id={trackId} onClose={closeSheet} />
        </div>
      )}
    </div>
  );
};

export default App;
