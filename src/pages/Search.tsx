import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchHistory } from "../hooks/useSearchHistory";

const SearchP = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { history, addToHistory, removeFromHistory } =
    useSearchHistory();

  const handleSearch = (q= query) => {
    if(!q.trim()) return
    addToHistory(q);
    navigate(`/search/results?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="w-full min-h-screen h-fit flex relative flex-col">
      <div className="w-full px-20 py-2">


        <div className="relative h-full w-full mt-10">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={(e)=> e.key === "Enter"&&handleSearch()}
            className="border w-full h-12 rounded-xl absolute  px-4"
            placeholder="Searching...."
            type="text"
          />

          <Search className="absolute right-3 top-3 cursor-pointer" onClick={()=>handleSearch()} />
        </div>

        {history.length > 0 && (
          <div className="mt-25 flex flex-col gap-1">

            {history.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-500/30 ease-in-out duration-150 cursor-pointer group"
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
