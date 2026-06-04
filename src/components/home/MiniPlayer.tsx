import { usePlayerStore } from "../../stores/usePlayerStore";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

const MiniPlayer = () => {
  const { track, playing, progress, duration, togglePlayPause, seek } =
    usePlayerStore();
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
        setVisible(true); // yukarı → göster
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

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className={`
        fixed left-0 right-0 z-50
        bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 border-t border-slate-600
        px-4 py-3
        flex items-center gap-4
        
        transition-transform duration-300
        sm:bottom-0
        bottom-15
        ${visible ? "translate-y-0" : "sm:translate-y-0 translate-y-full"}
      `}
    >
      {/* Track info */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => navigate(`/discover/music/${track.id}`)}
      >
        <img
          src={artwork}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md"
          alt=""
        />
        <div className="min-w-0">
          <p className="text-sm font-bold truncate text-white">{track.title}</p>
          <p className="text-xs text-slate-400 truncate">{track.user?.name}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => seek(0)}
          className="p-1 hover:bg-slate-700 rounded-full transition-colors"
          title="Restart"
        >
          <RotateCcw className="size-4 text-slate-300" />
        </button>
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center hover:shadow-lg transition-shadow"
        >
          {playing ? (
            <Pause className="size-5 text-white" />
          ) : (
            <Play className="size-5 text-white ml-0.5 fill-white" />
          )}
        </button>
      </div>

      {/* Progress bar and time - hidden on mobile, shown on sm+ */}
      <div className="hidden sm:flex items-center gap-2 w-48">
        <span className="text-xs text-slate-400 flex-shrink-0">
          {fmt(progress)}
        </span>
        <div className="flex-1 relative h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Seek"
          />
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">
          {fmt(duration)}
        </span>
      </div>

      {/* Volume indicator */}
      <div className="hidden lg:flex items-center gap-2">
        <Volume2 className="size-4 text-slate-400" />
      </div>
    </div>
  );
};

export default MiniPlayer;
