import { useFollowing } from "../stores/useFollowing";
import { useLastPlayed } from "../stores/useLastPlayed";
import { useNavigate } from "react-router";
import {
  Pause,
  Play,
  RotateCcw,
  ArrowRight,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import { getMultipleArtists } from "../api/tracks";
import CartArtist from "../components/home/CartArtist";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { X, ListMusic } from "lucide-react";
import { useTheme } from "../stores/themeStores";

const Homepage = () => {
  const { following } = useFollowing();
  const { lastPlayed } = useLastPlayed();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<any[]>([]);
  const { isDarkModeOn } = useTheme();
  

  const ArtistRef = useRef<HTMLDivElement>(null);

  const {
    track: playerTrack,
    playing,
    progress,
    duration,
    togglePlayPause,
    seek,
    play,
  } = usePlayerStore();

  const { playlists, addTrackToPlaylist, createPlaylist } = usePlaylistStore();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToPlaylist = (playlistId: string) => {
    if (!displayTrack) return;
    addTrackToPlaylist(playlistId, displayTrack);
    setAddedId(playlistId);
    setTimeout(() => {
      setAddedId(null);
      setShowPlaylistModal(false);
    }, 800);
  };

  const handleCreateAndAdd = () => {
    if (!playlistName.trim() || !displayTrack) return;
    createPlaylist(playlistName, playlistDesc);
    setTimeout(() => {
      const updated = usePlaylistStore.getState().playlists;
      const newest = updated[updated.length - 1];
      if (newest) addTrackToPlaylist(newest.id, displayTrack);
    }, 50);
    setPlaylistName("");
    setPlaylistDesc("");
    setShowCreateModal(false);
    setShowPlaylistModal(false);
  };

  const displayTrack = playerTrack || lastPlayed;
  const isPlaying = playing && !!playerTrack;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!playerTrack && lastPlayed) {
      play(lastPlayed);
    } else {
      togglePlayPause();
    }
  };

  const progressPercent =
    playerTrack?.id === displayTrack?.id
      ? (progress / (duration || 1)) * 100
      : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artists] = await Promise.all([
          getMultipleArtists([
            "eminem",
            "drake",
            "Kendrick",
            "justin-bieber",
            "the-weeknd",
          ]),
        ]);
        setArtists(artists);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const leftArtist = () => {
    ArtistRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const rightArtist = () => {
    ArtistRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 pb-24 overflow-hidden">
      {/* Welcome Header */}
      <div>
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-1 ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
        >
          Welcome Back
        </h1>
        <p
          className={`text-xs md:text-sm lg:text-base ${isDarkModeOn ? "text-white/60" : "text-gray-500"}`}
        >
          Continue listening to your favorite music
        </p>
      </div>

      {/* Last Played Banner */}
      {lastPlayed && (
        <div
          className="group w-full h-40 md:h-56 rounded-2xl overflow-hidden relative cursor-pointer shrink-0 hover:shadow-2xl transition-all duration-300"
          onClick={() =>
            lastPlayed && navigate(`/discover/music/${lastPlayed.id}`)
          }
        >
          <img
            className="w-full h-full object-cover scale-105 blur-sm group-hover:scale-110 group-hover:blur-none transition-all duration-300"
            src={
              lastPlayed.artwork?.["1000x1000"] ||
              lastPlayed.artwork?.["480x480"]
            }
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col md:flex-row items-center gap-3 md:gap-6 px-4 md:px-8 py-4 md:py-0">
            <img
              className="w-16 h-16 md:w-32 md:h-32 rounded-xl object-cover shadow-2xl transform group-hover:scale-105 transition-transform flex-shrink-0"
              src={
                lastPlayed.artwork?.["480x480"] ||
                lastPlayed.artwork?.["150x150"]
              }
              alt=""
            />
            <div className="flex text-white flex-col gap-1 md:gap-2 flex-1 text-center md:text-left">
              <p className="text-xs md:text-sm uppercase tracking-widest opacity-70 font-semibold">
                Last Played
              </p>
              <h2 className="text-lg md:text-3xl font-bold truncate">
                {lastPlayed.title}
              </h2>
              <p className="text-xs md:text-base opacity-80 truncate">
                {lastPlayed.user?.name}
              </p>

              <div className="flex items-center gap-2 md:gap-3 mt-2 justify-center md:justify-start">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex-shrink-0"
                >
                  {isPlaying && playerTrack?.id === lastPlayed.id ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1 fill-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 flex-1">
        {/* Following Artists */}
        <div className="lg:col-span-2 flex flex-col gap-3 md:gap-4">
          <div className="flex justify-between items-center">
            <h2
              className={`text-2xl md:text-3xl font-bold ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
            >
              Following
            </h2>
            {following.length > 0 && (
              <button
                onClick={() => navigate("/following")}
                className="text-green-500 hover:text-green-400 text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={16} />
              </button>
            )}
          </div>

          {following.length === 0 ? (
            <div
              className={`w-full h-32 md:h-40 flex items-center justify-center rounded-xl border-2 border-dashed ${isDarkModeOn ? "border-slate-600 bg-slate-800/50" : "border-gray-300 bg-gray-100"}`}
            >
              <div className="text-center">
                <p
                  className={`text-xs md:text-sm mb-3 ${isDarkModeOn ? "text-slate-400" : "text-gray-500"}`}
                >
                  No followed artists yet
                </p>
                <button
                  onClick={() => navigate("/discover")}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors text-xs md:text-sm"
                >
                  Discover Artists
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 overflow-y-auto max-h-96">
              {following.slice(0, 6).map((artist) => (
                <div
                  key={artist.id}
                  className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-lg group text-center ${
                    isDarkModeOn
                      ? "bg-slate-700/60 border-white/10 hover:bg-slate-600/60"
                      : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => navigate(`/user/${artist.id}`)}
                >
                  <img
                    src={artist.profile_picture?.["150x150"]}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover group-hover:scale-110 transition-transform flex-shrink-0"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p
                      className={`font-semibold text-xs md:text-sm truncate ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
                    >
                      {artist.name}
                    </p>
                    {artist.follower_count && (
                      <p
                        className={`text-xs truncate ${isDarkModeOn ? "text-white/60" : "text-gray-500"}`}
                      >
                        {(artist.follower_count / 1000).toFixed(1)}K
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Now Playing Card */}
        <div
          className={`rounded-2xl border p-4 md:p-6 flex flex-col gap-3 md:gap-4 shadow-lg h-fit ${
            isDarkModeOn
              ? "bg-slate-800/80 border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl md:text-2xl font-bold ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
          >
            Now Playing
          </h2>

          {displayTrack ? (
            <>
              {/* Artwork */}
              <div
                className="relative cursor-pointer group rounded-xl overflow-hidden"
                onClick={() => navigate(`/discover/music/${displayTrack.id}`)}
              >
                <img
                  src={
                    displayTrack.artwork?.["480x480"] ||
                    displayTrack.artwork?.["150x150"]
                  }
                  alt=""
                  className="w-full h-52 md:h-40 lg:h-48 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 rounded-xl transition-colors" />
              </div>

              {/* Track Info */}
              <div className="flex flex-col gap-1">
                <p
                  className={`font-bold text-sm md:text-lg truncate ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
                >
                  {displayTrack.title}
                </p>
                <p
                  className={`text-xs md:text-sm truncate ${isDarkModeOn ? "text-slate-300" : "text-gray-500"}`}
                >
                  {displayTrack.user?.name}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-2">
                <div
                  className={`relative h-2 rounded-full overflow-hidden ${isDarkModeOn ? "bg-slate-600" : "bg-gray-200"}`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={
                      playerTrack?.id === displayTrack.id
                        ? duration || 100
                        : 100
                    }
                    value={playerTrack?.id === displayTrack.id ? progress : 0}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div
                  className={`flex justify-between text-xs ${isDarkModeOn ? "text-slate-400" : "text-gray-400"}`}
                >
                  <span>
                    {playerTrack?.id === displayTrack.id
                      ? formatTime(progress)
                      : "0:00"}
                  </span>
                  <span>
                    {playerTrack?.id === displayTrack.id
                      ? formatTime(duration)
                      : "0:00"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 md:gap-3 mt-2">
                <button
                  onClick={() => {
                    if (playerTrack?.id === displayTrack.id) {
                      seek(0);
                    } else {
                      play(displayTrack);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${isDarkModeOn ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}
                  title="Restart"
                >
                  <RotateCcw
                    className={`size-6 md:size-7 ${isDarkModeOn ? "text-gray-500" : "text-gray-400"}`}
                  />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
                >
                  {isPlaying && playerTrack?.id === displayTrack.id ? (
                    <Pause className="size-6 md:size-7 text-white" />
                  ) : (
                    <Play className="size-6 md:size-7 text-white ml-0.5 fill-white" />
                  )}
                </button>

                <button
                  onClick={() => setShowPlaylistModal(true)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${isDarkModeOn ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}
                >
                  <Plus
                    className={`size-6 md:size-7 transition-colors ${isDarkModeOn ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${isDarkModeOn ? "bg-slate-600/50" : "bg-gray-100"}`}
              >
                <Play
                  className={`size-6 md:size-7 ${isDarkModeOn ? "text-slate-400" : "text-gray-400"}`}
                />
              </div>
              <p
                className={`text-xs md:text-sm text-center ${isDarkModeOn ? "text-slate-400" : "text-gray-400"}`}
              >
                Play a track to see it here
              </p>
              <button
                onClick={() => navigate("/discover")}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-xs md:text-sm transition-colors"
              >
                Discover Music
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Artists Section */}
      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2
            className={`lg:text-4xl sm:2xl text-xl font-black ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
          >
            Artist
          </h2>
          <div className="flex gap-5 items-center pb-3">
            <button
              onClick={leftArtist}
              className={`cursor-pointer transition-colors ${isDarkModeOn ? "text-white hover:text-green-400" : "text-gray-600 hover:text-green-500"}`}
            >
              <ArrowLeft size={30} />
            </button>
            <button
              onClick={rightArtist}
              className={`cursor-pointer transition-colors ${isDarkModeOn ? "text-white hover:text-green-400" : "text-gray-600 hover:text-green-500"}`}
            >
              <ArrowRight size={30} />
            </button>
          </div>
        </div>
        <div
          ref={ArtistRef}
          className="flex gap-10 overflow-x-auto scroll-smooth snap-x p-5 snap-mandatory scrollbar-hide"
        >
          {artists.map((data) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartArtist item={data as any} />
            </div>
          ))}
        </div>
      </div>

      {/* Playlist Seçim Modalı */}
      {showPlaylistModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPlaylistModal(false)}
        >
          <div
            className={`rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border ${
              isDarkModeOn
                ? "bg-slate-900 border-white/10"
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${isDarkModeOn ? "text-white/35" : "text-gray-400"}`}
                >
                  Add to Playlist
                </p>
                <p
                  className={`text-sm ${isDarkModeOn ? "text-white/55" : "text-gray-600"}`}
                >
                  <span className="text-green-500 font-medium">
                    "{displayTrack?.title}"
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDarkModeOn
                    ? "bg-white/10 text-white/50 hover:text-white hover:bg-white/15"
                    : "bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200"
                }`}
              >
                <X size={15} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto px-2 pb-2">
              {playlists.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <ListMusic
                    className={`size-10 ${isDarkModeOn ? "text-white/15" : "text-gray-300"}`}
                  />
                  <p
                    className={`text-sm ${isDarkModeOn ? "text-white/40" : "text-gray-400"}`}
                  >
                    No playlists yet
                  </p>
                </div>
              ) : (
                playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                      isDarkModeOn ? "hover:bg-white/7" : "hover:bg-gray-100"
                    }`}
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
                      <p
                        className={`text-sm font-medium truncate ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
                      >
                        {pl.name}
                      </p>
                      <p
                        className={`text-xs ${isDarkModeOn ? "text-white/35" : "text-gray-400"}`}
                      >
                        {pl.tracks.length} songs
                      </p>
                    </div>
                    {addedId === pl.id && (
                      <span className="text-green-500 text-sm font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            <div
              className={`border-t p-3 ${isDarkModeOn ? "border-white/8" : "border-gray-200"}`}
            >
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  setShowCreateModal(true);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-colors font-semibold text-sm ${
                  isDarkModeOn
                    ? "bg-green-500/12 hover:bg-green-500/22 text-green-400"
                    : "bg-green-500/10 hover:bg-green-500/20 text-green-600"
                }`}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={`rounded-2xl p-6 max-w-md w-full shadow-2xl border ${
              isDarkModeOn
                ? "bg-slate-800 border-white/10"
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-bold ${isDarkModeOn ? "text-white" : "text-gray-900"}`}
              >
                Create New Playlist
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`transition-colors ${isDarkModeOn ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
              >
                <X size={20} />
              </button>
            </div>

            <p
              className={`text-sm mb-4 ${isDarkModeOn ? "text-white/50" : "text-gray-500"}`}
            >
              <span
                className={`font-medium ${isDarkModeOn ? "text-green-400" : "text-green-600"}`}
              >
                "{displayTrack?.title}"
              </span>{" "}
              will be added automatically.
            </p>

            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
              className={`w-full px-4 py-3 rounded-lg border mb-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 ${
                isDarkModeOn
                  ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400"
              }`}
              autoFocus
            />

            <textarea
              placeholder="Description (optional)"
              value={playlistDesc}
              onChange={(e) => setPlaylistDesc(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border mb-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 resize-none ${
                isDarkModeOn
                  ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400"
              }`}
              rows={2}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isDarkModeOn
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
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
    </div>
  );
};

export default Homepage;
