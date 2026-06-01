import { Outlet } from "react-router";
import MiniPlayer from "../home/MiniPlayer";
import { useTrackSheet } from "../../stores/useTrackSheet";
import MusicDetailsContent from "../home/MusicDetailsContent";
import { X } from "lucide-react";


const Layout = () => {
  const { isOpen, trackId, closeSheet } = useTrackSheet();

  return (
    <div>
      <Outlet />
      <MiniPlayer />

      {/* Desktop Sheet */}
      {isOpen && trackId && (
        <div className="fixed inset-0 z-50 hidden lg:flex">
          {/* backdrop */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={closeSheet}
          />
          {/* panel */}
          <div className="w-[55vw] h-full bg-white dark:bg-[#0f0f13] shadow-2xl overflow-y-auto animate-slide-in-right">
            <button
              onClick={closeSheet}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="size-5" />
            </button>
            <MusicDetailsContent id={trackId} />
          </div>
        </div>
      )}
    </div>
  );
};