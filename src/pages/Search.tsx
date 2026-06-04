import { Search, X, Music } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchHistory } from "../stores/useSearchHistory";
import { searchTracks, getUserSearch } from "../api/tracks";
import type { Track } from "../types/track";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTrackSheet } from "../stores/useTrackSheet";

const SearchP = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { history, addToHistory, removeFromHistory } = useSearchHistory();
  const isMobile = useIsMobile();
  const { openSheet } = useTrackSheet();

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    addToHistory(q);
    navigate(`/search/results?q=${encodeURIComponent(q)}`);
  };

  const handleInputChange = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setUsers([]);
      return;
    }
    try {
      setLoading(true);
      const [tracks, userResults] = await Promise.all([
        searchTracks(val),
        getUserSearch(val),
      ]);
      setResults(tracks);
      setUsers(Array.isArray(userResults) ? userResults : [userResults]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackClick = (track: Track) => {
    if (isMobile) {
      navigate(`/discover/music/${track.id}`);
    } else {
      openSheet(track.id);
    }
  };

  const hasResults = results.length > 0 || users.length > 0;

  return (
    <div className="w-full min-h-screen h-fit flex relative flex-col">
      <div className="w-full sm:px-20 px-4  py-2">

        {/* Search input */}
        <div className="relative  w-full mt-10">
          <input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border w-full h-12 rounded-xl px-4 pr-10"
            placeholder="Search for music or artists"
            type="text"
          />
          <Search
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => handleSearch()}
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="mt-6 text-sm text-gray-400 animate-pulse">Searching...</p>
        )}

        {/* Inline preview results */}
        {!loading && hasResults && (
          <div className="mt-6 flex flex-col gap-6">

            {/* Tracks */}
            {results.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                    Tracks
                  </h2>
                  <button
                    onClick={() => handleSearch()}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    See all
                  </button>
                </div>
                {results.slice(0, 5).map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-500/30 duration-150 cursor-pointer"
                  >
                    <img
                      src={track.artwork?.["150x150"] || track.artwork?.["480x480"]}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-gray-400 truncate">{track.user?.name}</p>
                    </div>
                    <Music className="size-4 text-gray-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* Users */}
            {users.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest px-1">
                  Artists
                </h2>
                {users.slice(0, 3).map((user: any) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-500/30 duration-150 cursor-pointer"
                  >
                    <img
                      src={user.profile_picture?.["150x150"] || user.profile_picture?.["480x480"]}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.follower_count?.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {!loading && !hasResults && history.length > 0 && (
          <div className=" flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest px-1 mb-2 mt-5">
              Recent
            </h2>
            {history.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-500/30 duration-150 cursor-pointer group"
              >
                <div
                  className="flex items-center gap-3 flex-1"
                  onClick={() => handleSearch(item)}
                >
                  <Search className="size-4 text-gray-400" />
                  <span className="text-sm">{item}</span>
                </div>
                <X
                  className="size-4 text-gray-300 group-hover:text-gray-100 cursor-pointer"
                  onClick={() => removeFromHistory(item)}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchP;