import { useFollowing } from "../hooks/useFollowing";
import { useLastPlayed } from "../hooks/useLastPlayed";
import { useNavigate } from "react-router";
import { Play } from "lucide-react";

const Homepage = () => {
  const { following } = useFollowing();
  const { lastPlayed } = useLastPlayed();
  const navigate = useNavigate();
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

              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
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
        {/* Right — now playing placeholder */}
      <div className="sm:w-83 shrink-0 rounded-lg bg-gray-500 border border-gray-400 p-5 flex flex-col gap-3">
        <h2 className="text-xl font-black">Now playing</h2>
        {lastPlayed ? (
          <div
            onClick={() => navigate(`/discover/music/${lastPlayed.id}`)}
            className="flex flex-col gap-3 cursor-pointer"
          >
            <img
              src={lastPlayed.artwork?.["480x480"]}
              alt=""
              className="w-full rounded-lg object-cover aspect-square"
            />
            <p className="font-semibold truncate">{lastPlayed.title}</p>
            <p className="text-sm text-gray-400 truncate">
              {lastPlayed.user?.name}
            </p>
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
