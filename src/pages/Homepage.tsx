import { useFollowing } from "../stores/useFollowing";
import { useLastPlayed } from "../stores/useLastPlayed";
import { useNavigate } from "react-router";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { usePlayerStore } from "../stores/usePlayerStore";

const Homepage = () => {
  const { following } = useFollowing();
  const { lastPlayed } = useLastPlayed();
  const navigate = useNavigate();

  const {
    track: playerTrack,
    playing,
    progress,
    duration,
    togglePlayPause,
    seek,
    play,
  } = usePlayerStore();

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

  return (
    <div className="w-full min-h-screen h-fit flex flex-col p-6 gap-4 overflow-hidden">
      {/* Top — son dinlenen */}
      <div
        className="w-full h-50 rounded-lg overflow-hidden relative cursor-pointer shrink-0"
        onClick={() =>
          lastPlayed && navigate(`/discover/music/${lastPlayed.id}`)
        }
      >
        {lastPlayed ? (
          <>
            <img
              className="w-full h-full object-cover scale-105 blur-sm"
              src={
                lastPlayed.artwork?.["1000x1000"] ||
                lastPlayed.artwork?.["480x480"]
              }
              alt=""
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center gap-5 px-8">
              <img
                className="w-20 h-20 rounded-lg object-cover shadow-lg"
                src={
                  lastPlayed.artwork?.["480x480"] ||
                  lastPlayed.artwork?.["150x150"]
                }
                alt=""
              />
              <div className="flex text-white flex-col gap-1 flex-1">
                <p className="text-xs uppercase tracking-widest opacity-70">
                  Last Played
                </p>
                <h2 className="text-lg font-black truncate">
                  {lastPlayed.title}
                </h2>
                <p className="text-sm opacity-70">{lastPlayed.user?.name}</p>
              </div>

              <div className="w-12 h-12 lg:flex hidden rounded-full bg-white items-center justify-center shadow">
                <Play className="size-5 text-black ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">No recent plays yet</p>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="w-full flex flex-col sm:flex-row gap-4 flex-1 overflow-hidden">
        {/* Left — following artists */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {following.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg border border-dashed border-gray-400">
              <p className="text-gray-400 text-sm">
                Follow artists to see them here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {following.map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-500/50 cursor-pointer border border-gray-400 transition"
                  onClick={() => navigate(`/user/${artist.id}`)}
                >
                  <img
                    src={artist.profile_picture?.["150x150"]}
                    className="size-12 rounded-full object-cover"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">{artist.name}</p>
                    {artist.follower_count && (
                      <p className="text-sm text-gray-400">
                        {artist.follower_count.toLocaleString()} Followers
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — now playing */}
        <div className="sm:w-83 shrink-0 rounded-lg bg-gray-500 border border-gray-400 p-5 flex flex-col gap-3">
          <h2 className="text-xl font-black">Now playing</h2>

          {displayTrack ? (
            <div className="flex flex-col gap-3">
              {/* Artwork — tıklayınca detay sayfasına git */}
              <div
                className="relative cursor-pointer group"
                onClick={() =>
                  navigate(`/discover/music/${displayTrack.id}`)
                }
              >
                <img
                  src={displayTrack.artwork?.["480x480"]}
                  alt=""
                  className="w-full h-50 rounded-lg object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition" />
              </div>

              <p className="font-semibold truncate">{displayTrack.title}</p>
              <p className="text-sm text-gray-400 truncate">
                {displayTrack.user?.name}
              </p>

              {/* Progress bar */}
              <div className="flex flex-col gap-1">
                <input
                  type="range"
                  min={0}
                  max={playerTrack?.id === displayTrack.id ? duration || 100 : 100}
                  value={playerTrack?.id === displayTrack.id ? progress : 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-300">
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
              <div className="flex items-center justify-center gap-4 mt-1">
                <button
                  onClick={() => {
                    if (playerTrack?.id === displayTrack.id) {
                      seek(0);
                    } else {
                      play(displayTrack);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-white/20 transition"
                >
                  <RotateCcw className="size-4 text-white" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition"
                >
                  {isPlaying && playerTrack?.id === displayTrack.id ? (
                    <Pause className="size-5 text-black" />
                  ) : (
                    <Play className="size-5 text-black ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => navigate(`/discover/music/${displayTrack.id}`)}
                  className="p-2 rounded-full hover:bg-white/20 transition"
                  title="Detay sayfasına git"
                >
                  <SkipForward className="size-4 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-300 text-sm text-center">
                Play a track to see it here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;