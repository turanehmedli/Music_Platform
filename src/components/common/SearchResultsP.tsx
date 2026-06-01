import { ArrowLeft, Search } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { searchTracks } from "../../api/tracks";
import type { Track } from "../../types/track";
import CartTrending from "../../components/home/CartTrending";

const SearchResultsP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResult([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchTracks(query);
        setResult(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center sm:mt-10 gap-3 px-4 py-3 sticky top-0 z-10">
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

      {/* Results */}
      <div className="px-4 py-4">
        {loading && (
          <p className="text-gray-400 text-center mt-10">Searching...</p>
        )}
        {!loading && query && result.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No results found.</p>
        )}
        <div className="grid grid-cols-4 gap-4">
          {result.map((track) => (
            <CartTrending key={track.id} item={track} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsP;
