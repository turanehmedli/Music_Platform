import { Heart, Pause, Play, Plus, X, ListMusic } from "lucide-react";
import type { Track } from "../../types/track";
import { useFavorites } from "../../stores/useFavSong";
import { useNavigate } from "react-router";
import { useTheme } from "../../stores/themeStores";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTrackSheet } from "../../stores/useTrackSheet";
import { usePlaylistStore } from "../../stores/usePlaylistStore";
import { useState } from "react";

type CartTrendingProps = {
  item: Track;
  onPlay?: () => void;
  onAddToPlaylist?: (track: Track) => void;
};

const CartTrending = ({ item, onPlay }: CartTrendingProps) => {
  const { track, playing, togglePlayPause, play } = usePlayerStore();
  const { isDarkModeOn } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(item.id);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openSheet } = useTrackSheet();
  const { playlists, addTrackToPlaylist, createPlaylist } = usePlaylistStore();

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleCardClick = () => {
    if (isMobile) {
      onPlay?.();
      navigate(`/discover/music/${item.id}`);
    } else {
      onPlay?.();
      openSheet(item.id);
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addTrackToPlaylist(playlistId, item);
    setAddedId(playlistId);
    setTimeout(() => {
      setAddedId(null);
      setShowPlaylistModal(false);
    }, 800);
  };

  const handleCreateAndAdd = () => {
    if (!playlistName.trim()) return;
    createPlaylist(playlistName, playlistDesc);
    setTimeout(() => {
      const updated = usePlaylistStore.getState().playlists;
      const newest = updated[updated.length - 1];
      if (newest) addTrackToPlaylist(newest.id, item);
    }, 50);
    setPlaylistName("");
    setPlaylistDesc("");
    setShowCreateModal(false);
    setShowPlaylistModal(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`
          sm:max-w-55 h-fit max-w-60 w-full flex flex-col gap-2 cursor-pointer
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
                  onPlay ? onPlay() : play(item);
                }
              }}
              className="
                w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center
                shadow-lg shadow-black/40 transition-all duration-200
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

            {/* Plus → playlist modal */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistModal(true);
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
            <p className={`text-xs truncate ${isDarkModeOn ? "text-white/40" : "text-black/40"}`}>
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

      {/* Playlist Seçim Modalı */}
      {showPlaylistModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPlaylistModal(false)}
        >
          <div
            className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-1">
                  Add to Playlist
                </p>
                <p className="text-sm text-white/55">
                  <span className="text-green-400 font-medium">"{item.title}"</span>
                </p>
              </div>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto px-2 pb-2">
              {playlists.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <ListMusic className="size-10 text-white/15" />
                  <p className="text-sm text-white/40">No playlists yet</p>
                </div>
              ) : (
                playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/7 transition-colors text-left"
                  >
                    <div className="size-9 rounded-lg bg-green-500/15 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {pl.tracks[0]?.artwork?.["150x150"] ? (
                        <img
                          src={pl.tracks[0].artwork["150x150"]}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ListMusic className="size-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{pl.name}</p>
                      <p className="text-xs text-white/35">{pl.tracks.length} songs</p>
                    </div>
                    {addedId === pl.id && (
                      <span className="text-green-400 text-sm font-bold">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-white/8 p-3">
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  setShowCreateModal(true);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-green-500/12 hover:bg-green-500/22 transition-colors text-green-400 font-semibold text-sm"
              >
                <Plus className="size-4" />
                Create new playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Playlist Oluşturma Modalı */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Create New Playlist</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-white/50 mb-4">
              <span className="text-green-400 font-medium">"{item.title}"</span>{" "}
              will be added automatically.
            </p>

            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 placeholder:text-slate-400"
              autoFocus
            />

            <textarea
              placeholder="Description (optional)"
              value={playlistDesc}
              onChange={(e) => setPlaylistDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 placeholder:text-slate-400 resize-none"
              rows={2}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAndAdd}
                disabled={!playlistName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
              >
                Create & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTrending;