import { useNavigate } from "react-router";
import { usePlayerStore } from "../stores/usePlayerStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { useState } from "react";
import { Play, Plus, Trash2 } from "lucide-react";

const Playlist = () => {
  const { playlists, createPlaylist, deletePlaylist, setCurrentPlaylist } =
    usePlaylistStore();
  const { play } = usePlayerStore();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName, playlistDesc);
      setPlaylistName("");
      setPlaylistDesc("");
      setModal(false);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist && playlist.tracks.length > 0) {
      setCurrentPlaylist(playlist);
      play(playlist.tracks[0]);
    }
  };

  const handleViewPlaylist = (playlistId: string) => {
    setCurrentPlaylist(playlists.find((p) => p.id === playlistId) || null);
    navigate(`/playlist/${playlistId}`);
  };
  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-6 lg:p-8 gap-8 pb-24">
      <div className="flex  flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl">Your Playlists</h1>
          <p>
            {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={()=>{
            setModal(true)
        }} className="w-auto flex items-center justify-center gap-2 px-3 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
          <Plus size={20} />
          <span>New Playlist</span>
        </button>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in">
            <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>

            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 placeholder:text-slate-400"
              autoFocus
            />

            <textarea
              placeholder="Description (optional)"
              value={playlistDesc}
              onChange={(e) => setPlaylistDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white mb-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 placeholder:text-slate-400 resize-none"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="flex-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors transform hover:scale-105"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
            <Plus className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              No Playlists Yet
            </h2>
            <p className="opacity-60 max-w-md mb-6">
              Create your first playlist to start organizing your favorite music
            </p>
            <button
              onClick={() => setModal(true)}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Create Playlist
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => handleViewPlaylist(playlist.id)}
              className="group rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Playlist Cover */}
              <div className="relative aspect-square bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-end justify-start p-3 md:p-4 overflow-hidden">
                {/* Background tracks grid */}
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2 opacity-10">
                  {playlist.tracks.slice(0, 6).map((track, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-white"
                      style={{
                        backgroundImage: `url(${
                          track.artwork?.["150x150"] ||
                          track.artwork?.["480x480"]
                        })`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent" />

                {/* Play button on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPlaylist(playlist.id);
                  }}
                  className="absolute bottom-3 md:bottom-4 right-3 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                >
                  <Play
                    size={20}
                    className="text-white fill-white md:w-6 md:h-6"
                  />
                </button>

                {/* Playlist info at bottom */}
                <div className="relative z-10">
                  <h3 className="font-bold text-sm md:text-base truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-xs opacity-70">
                    {playlist.tracks.length} song
                    {playlist.tracks.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 md:p-4 flex gap-2 bg-slate-800 border-t border-slate-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewPlaylist(playlist.id);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs md:text-sm font-semibold transition-colors"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(playlist.id);
                  }}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
