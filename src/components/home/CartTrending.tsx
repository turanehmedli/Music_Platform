import { Heart, Pause, Play, Plus } from "lucide-react";
import type { Track } from "../../types/track";
import { useFavorites } from "../../stores/useFavSong";
import { useNavigate } from "react-router";
import { useTheme } from "../../stores/themeStores";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTrackSheet } from "../../stores/useTrackSheet";

type CartTrendingProps = {
  item: Track;
  onPlay?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
};

const CartTrending = ({ item, onPlay, onAddToPlaylist }: CartTrendingProps) => {
  const { track, playing, progress, duration, togglePlayPause, seek, play } =
    usePlayerStore();
  const { isDarkModeOn } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(item.id);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openSheet } = useTrackSheet()

  const handleCardClick = () => {
    if (isMobile) {
      navigate(`/discover/music/${item.id}`);
    } else {
      openSheet(item.id)
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        sm:max-w-55 max-w-60 w-full flex flex-col gap-2 cursor-pointer
        ${isDarkModeOn ? "bg-[#1a1a24] border-white/5" : "bg-[#f3f3f5] border-black/5"}
        border p-2.5 rounded-2xl
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-2xl
        ${isDarkModeOn ? "hover:border-white/10 hover:shadow-black/50" : "hover:border-black/10 hover:shadow-black/15"}
        group
      `}
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-50"
          src={
            item.artwork?.["480x480"] ||
            item.artwork?.["150x150"] ||
            item.artwork?.["1000x1000"]
          }
          alt={item.title}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-xl flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Play button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (track?.id === item.id) {
                togglePlayPause();
              } else {
                play(item);
              }
            }}
            className="
    w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center
    shadow-lg shadow-black/40
    transition-all duration-200
    scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100
    hover:scale-110 hover:bg-green-600
    [transition-delay:40ms]
  "
          >
            {playing && track?.id === item.id ? (
              <Pause className="size-4 fill-white" />
            ) : (
              <Play className="size-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Add to playlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist?.(item);
            }}
            className="
              w-11 h-11 rounded-full bg-white/15 backdrop-blur-md text-white
              border border-white/25 flex items-center justify-center
              transition-all duration-200
              scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100
              hover:scale-110 hover:bg-white/25
              [transition-delay:80ms]
            "
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="w-full flex flex-col gap-1.5 px-1 overflow-hidden">
        <h3
          className={`text-sm font-bold truncate tracking-tight ${
            isDarkModeOn ? "text-white/90" : "text-gray-900"
          }`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {item.title}
        </h3>
        <div className="w-full flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              isDarkModeOn ? "text-white/40" : "text-black/40"
            }`}
          >
            {item.user?.name}
          </p>
          <Heart
            className={`size-4 flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125 ${
              liked
                ? "fill-red-500 text-red-500"
                : isDarkModeOn
                  ? "text-white/30 hover:text-red-400"
                  : "text-black/25 hover:text-red-400"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CartTrending;
