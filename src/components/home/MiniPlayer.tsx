
import { usePlayerStore } from "../../stores/usePlayerStore";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

const MiniPlayer = () => {
  const { track, playing, progress, duration, togglePlayPause, seek } = usePlayerStore();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false); // aşağı → gizle
      } else {
        setVisible(true);  // yukarı → göster
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!track) return null;

  const artwork = track.artwork?.["150x150"] || track.artwork?.["480x480"];
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div
      className={`
        fixed left-0 right-0 z-50
        bg-black border-t border-gray-600
        px-4 py-3
        flex items-center gap-4
        shadow-lg
        transition-transform duration-300
        sm:bottom-0
        bottom-16
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        onClick={() => navigate(`/discover/music/${track.id}`)}
      >
        <img src={artwork} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{track.title}</p>
          <p className="text-xs text-gray-400 truncate">{track.user?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => seek(0)}>
          <RotateCcw className="size-4 text-gray-500" />
        </button>
        <button
          onClick={togglePlayPause}
          className="w-9 h-9 rounded-full bg-black flex items-center justify-center"
        >
          {playing ? (
            <Pause className="size-4 text-white" />
          ) : (
            <Play className="size-4 text-white ml-0.5" />
          )}
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-2 w-48">
        <span className="text-xs text-gray-400">{fmt(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className="flex-1 accent-black"
        />
        <span className="text-xs text-gray-400">{fmt(duration)}</span>
      </div>
    </div>
  );
};

export default MiniPlayer;