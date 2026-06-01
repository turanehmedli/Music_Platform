import { Route, Routes, Navigate } from "react-router";
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

  return (
    <div
      className={`w-full min-h-screen h-fit flex flex-col justify-center relative items-center ease-in-out duration-200 xl:pl-60 sm:pb-10 pb-15 overflow-hidden ${
        isDarkModeOn
          ? "bg-slate-900 text-amber-50"
          : "bg-gray-100 text-shadow-amber-50"
      } select-none`}
    >
      {accessToken && hasHydrated && (
        <>
          <div className="hidden xl:block fixed left-0 top-0 h-full w-[250px]">
            <DrawerBar />
          </div>
          <div className="w-full flex xl:hidden">
            <NavBar />
          </div>
          <div className="w-full flex sm:hidden">
            <TabBar />
          </div>
        </>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/favorite" element={<ProtectedRoute><Favorite /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/search/results" element={<ProtectedRoute><SearchResultsP /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
        <Route path="/discover/music/:id" element={<ProtectedRoute><MusicDetails /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserProfileP /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {accessToken && hasHydrated && (
        <MiniPlayer />
      )}

      {/* Desktop Sheet */}
      {isOpen && trackId && (
        <div className="fixed inset-0 z-10 hidden lg:flex">
          {/* Backdrop */}
          <div
            className="flex-1 "
            onClick={closeSheet}
          />
          {/* Panel */}
          <div
            className="w-100 h-full overflow-y-auto relative shadow-2xl"
            style={{
              animation: "slideIn 0.3s cubic-bezier(.22,1,.36,1)",
              background: isDarkModeOn ? "#0f0f13" : "#ffffff",
            }}
          >
            <button
              onClick={closeSheet}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition"
            >
              <X className={`size-5 ${isDarkModeOn ? "text-white" : "text-black"}`} />
            </button>
            <MusicDetailsContent id={trackId} onClose={closeSheet} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;