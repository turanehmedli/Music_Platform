import { useTheme } from "../../stores/themeStores";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { Pause, Play, RotateCcw } from "lucide-react";

const MiniPlayer = () => {
  const { track, playing, progress, duration, togglePlayPause, seek } =
    usePlayerStore();
    const {isDarkModeOn} = useTheme()

  if (!track) return null;

  const artwork =
    track.artwork?.["150x150"] || track.artwork?.["480x480"];

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className={`fixed bottom-0 left-0 ${isDarkModeOn? "bg-gray-800 text-white":'bg-amber-100 text-black '}  right-0 z-50 border-t border-gray-600 border-b px-4 py-2 flex items-center  gap-4 shadow-lg`}>
      <img src={artwork} className="w-10 h-10 rounded-lg object-cover" alt="" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{track.title}</p>
        <p className="text-xs text-gray-400 truncate">{track.user?.name}</p>
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