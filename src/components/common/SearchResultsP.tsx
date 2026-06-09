import { ArrowLeft, Search, User } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { searchTracks, getUserSearch } from "../../api/tracks";
import type { Track } from "../../types/track";
import CartTrending from "../../components/home/CartTrending";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTrackSheet } from "../../stores/useTrackSheet";

type TabType = "tracks" | "artists";

const SearchResultsP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabType>("tracks");

  const isMobile = useIsMobile();
  const { openSheet } = useTrackSheet();

  useEffect(() => {
    if (!query.trim()) {
      setTracks([]);
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [trackData, userData] = await Promise.all([
          searchTracks(query),
          getUserSearch(query),
        ]);
        setTracks(trackData);
        setUsers(Array.isArray(userData) ? userData : [userData]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleTrackClick = (track: Track) => {
    if (isMobile) {
      navigate(`/discover/music/${track.id}`);
    } else {
      openSheet(track.id);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">

     
      <div className="flex items-center sm:mt-10 gap-3 px-4 py-3 sticky top-0 z-10 backdrop-blur-sm">
        <ArrowLeft
          className="cursor-pointer shrink-0"
          onClick={() => navigate(-1)}
        />
        <div className="relative flex-1">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border w-full h-10 rounded-xl px-4 pr-10 text-sm"
            placeholder="Search..."
            type="text"
          />
          <Search className="absolute right-3 top-2.5 size-4 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-2">
        <button
          onClick={() => setTab("tracks")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === "tracks"
              ? "bg-black  dark:bg-white dark:text-black"
              : "bg-gray-200 text-gray-600 hover:bg-zinc-500 dark:bg-white/10 dark:text-gray-300"
          }`}
        >
          Tracks {tracks.length > 0 && `(${tracks.length})`}
        </button>
        <button
          onClick={() => setTab("artists")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === "artists"
              ? "bg-black  dark:bg-white dark:text-black"
              : " text-gray-600 hover:bg-zinc-500  dark:bg-white/10 dark:text-gray-300"
          }`}
        >
          Artists {users.length > 0 && `(${users.length})`}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {loading && (
          <p className="text-gray-400 text-center mt-10 animate-pulse">Searching...</p>
        )}

        {/* Tracks tab */}
        {!loading && tab === "tracks" && (
          <>
            {tracks.length === 0 && query && (
              <p className="text-gray-400 text-center mt-10">No tracks found.</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tracks.map((track) => (
                <div key={track.id} onClick={() => handleTrackClick(track)}>
                  <CartTrending item={track} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Artists tab */}
        {!loading && tab === "artists" && (
          <>
            {users.length === 0 && query && (
              <p className="text-gray-400 text-center mt-10">No artists found.</p>
            )}
            <div className="flex flex-col gap-2">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-500/20 duration-150 cursor-pointer"
                >
                  <img
                    src={user.profile_picture?.["150x150"] || user.profile_picture?.["480x480"]}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.follower_count?.toLocaleString()} followers
                    </p>
                  </div>
                  <User className="size-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsP;