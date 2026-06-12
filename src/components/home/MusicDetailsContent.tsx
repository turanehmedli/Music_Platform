import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import type { Track } from "../../types/track";
import {
  ArrowLeft,
  Heart,
  ListMusic,
  Pause,
  Play,
  Plus,
  RotateCcw,
  StepBack,
  StepForward,
  X,
} from "lucide-react";
import { useFavorites } from "../../stores/useFavSong";
import { useLastPlayed } from "../../stores/useLastPlayed";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useTheme } from "../../stores/themeStores";
import { usePlaylistStore } from "../../stores/usePlaylistStore";

type Props = { id: string; onClose?: () => void };

const MusicDetailsContent = ({ id, onClose }: Props) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setLastPlayed } = useLastPlayed();
  const { isDarkModeOn } = useTheme();
  const { playlists, addTrackToPlaylist, createPlaylist } = usePlaylistStore();

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const {
    play,
    togglePlayPause,
    seek,
    progress,
    duration,
    playing,
    track: playerTrack,
    nextTrack,
    prevTrack,
  } = usePlayerStore();

  const isCurrentTrack = playerTrack?.id === track?.id;
  const isPlaying = isCurrentTrack && playing;
  const currentProgress = isCurrentTrack ? progress : 0;
  const currentDuration = isCurrentTrack ? duration : 0;

  // Sadece track'i fetch et — queue'ya dokunma
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tracks/${id}`);
        setTrack(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTrack();
  }, [id]);

  useEffect(() => {
  if (playerTrack && playerTrack.id !== track?.id) {
    setTrack(playerTrack);
  }
}, [playerTrack]);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const handlePlayPause = () => {
    if (!track) return;
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      play(track);
      setLastPlayed(track);
    }
  };

  const handleReplay = () => {
    if (!track) return;
    if (isCurrentTrack) {
      seek(0);
      if (!playing) togglePlayPause();
    } else {
      play(track);
      setLastPlayed(track);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCurrentTrack) return;
    seek(Number(e.target.value));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (!track) return;
    addTrackToPlaylist(playlistId, track);
    setAddedId(playlistId);
    setTimeout(() => {
      setAddedId(null);
      setShowPlaylistModal(false);
    }, 800);
  };

  const handleCreateAndAdd = () => {
    if (!playlistName.trim() || !track) return;
    createPlaylist(playlistName, playlistDesc);
    setTimeout(() => {
      const updated = usePlaylistStore.getState().playlists;
      const newest = updated[updated.length - 1];
      if (newest) addTrackToPlaylist(newest.id, track);
    }, 50);
    setPlaylistName("");
    setPlaylistDesc("");
    setShowCreateModal(false);
    setShowPlaylistModal(false);
  };

  const PlaylistButton = () => (
    <button
      onClick={() => setShowPlaylistModal(true)}
      className="cursor-pointer"
    >
      <Plus className="size-8 text-gray-600 hover:text-white transition-colors" />
    </button>
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Track not found</p>
      </div>
    );
  }

  const liked = isFavorite(track.id);
  const artwork =
  playerTrack?.artwork?.["1000x1000"] ||
  playerTrack?.artwork?.["480x480"] ||
  playerTrack?.artwork?.["150x150"] ||
  track?.artwork?.["1000x1000"] ||
  track?.artwork?.["480x480"] ||
  track?.artwork?.["150x150"];

  const Controls = () => (
    <div className="flex items-center justify-center gap-8">
      <button onClick={handleReplay} className="cursor-pointer">
        <RotateCcw className="size-8 text-gray-600" />
      </button>
      <button
        onClick={prevTrack}
        className="cursor-pointer hover:text-white transition-colors"
      >
        <StepBack className="size-8 text-gray-600" />
      </button>
      <button
        onClick={handlePlayPause}
        className="size-13 rounded-full bg-gray-50/20 border flex items-center justify-center shadow-lg cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="size-8" />
        ) : (
          <Play className="size-8 ml-1" />
        )}
      </button>
      <button
        onClick={nextTrack}
        className="cursor-pointer hover:text-white transition-colors"
      >
        <StepForward className="size-8 text-gray-600" />
      </button>
      <PlaylistButton />
    </div>
  );

  const TrackInfo = () => (
    <div className="flex flex-col gap-1 flex-1">
      <h1 className="sm:text-lg text-md font-black">{track.title}</h1>
      <div className="w-full gap-5  flex items-center mt-3">
        <button
          className="text-gray-500 text-sm text-left hover:underline flex items-center gap-3"
          onClick={() => {
            const userId = (track.user as { id?: string })?.id;
            if (userId) navigate(`/user/${userId}`);
          }}
        >
          <div className="flex gap-3 items-center">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src={(track.user as any)?.profile_picture?.["150x150"]}
            />
            <p>{track.user?.name}</p>
          </div>
        </button>
        <button className="cursor-pointer" onClick={() => toggleFavorite(track)}>
          <Heart
            className={`size-7 hover:text-red-500 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>
    </div>
  );

  const SeekBar = () => (
    <div className="flex items-center gap-5 w-full">
      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={currentDuration || 100}
          value={currentProgress}
          onChange={handleSeek}
          className="w-full accent-black cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentProgress)}</span>
          <span>{formatTime(currentDuration)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`w-full min-h-screen flex flex-col ${
          isDarkModeOn ? "text-white" : "text-black"
        }`}
      >
        {/* Mobile */}
        <div className="flex flex-col lg:hidden">
          <div className="relative w-full sm:h-[50vh] h-[30vh] overflow-hidden">
            <img
              src={artwork}
              alt=""
              className="w-full h-full object-cover scale-110 blur-sm opacity-60"
            />
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={handleClose}
              className="absolute z-10 top-4 left-4 text-white bg-black/30 p-2 rounded-full cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={artwork}
                alt=""
                className="w-32 h-32 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 px-6 py-8">
            <TrackInfo />
            <SeekBar />
            <div className="w-full">
              <Controls />
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="flex-col lg:flex hidden">
          <div className="relative w-full sm:h-[50vh] h-[30vh] overflow-hidden">
            <img
              src={artwork}
              alt=""
              className="w-full object-cover scale-110 blur-sm opacity-60"
            />
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={handleClose}
              className="absolute z-10 top-4 left-4 bg-black/30 p-2 rounded-full cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={artwork}
                alt=""
                className="w-32 h-32 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 px-6 py-8">
            <TrackInfo />
            <SeekBar />
            <div className="w-full">
              <Controls />
            </div>
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
                  <span className="text-green-400 font-medium">
                    "{track.title}"
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto px-2 pb-2">
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
                      <p className="text-sm font-medium text-white truncate">
                        {pl.name}
                      </p>
                      <p className="text-xs text-white/35">
                        {pl.tracks.length} songs
                      </p>
                    </div>
                    {addedId === pl.id && (
                      <span className="text-green-400 text-sm font-bold">
                        ✓
                      </span>
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
              <h2 className="text-xl font-bold text-white">
                Create New Playlist
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-white/50 mb-4">
              <span className="text-green-400 font-medium">
                "{track.title}"
              </span>{" "}
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

export default MusicDetailsContent;