import { useParams, useNavigate } from "react-router";
import { usePlaylistStore } from "../../stores/usePlaylistStore";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { ArrowLeft, Play, Trash2 } from "lucide-react";
import { useState } from "react";

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, removeTrackFromPlaylist, updatePlaylist } =
    usePlaylistStore();
  const { play, track: currentTrack } = usePlayerStore();
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Playlist not found</h2>
          <button
            onClick={() => navigate("/playlists")}
            className="px-4 py-2 bg-green-500 rounded-full font-semibold"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  const handleUpdatePlaylist = () => {
    updatePlaylist(playlist.id, {
      name: editName || playlist.name,
      description: editDesc || playlist.description,
    });
    setIsEditing(false);
  };

  const handlePlayTrack = (trackId: string) => {
    const track = playlist.tracks.find((t) => t.id === trackId);
    if (track) play(track);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-4 md:p-6 lg:p-8 gap-6 pb-24">
      {/* Back Button */}
      <button
        onClick={() => navigate("/playlists")}
        className="flex items-center gap-2 text-green-500 hover:text-green-400 w-fit transition-colors font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Playlists
      </button>

      {/* Playlist Info Section */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-4 md:p-8 flex flex-col md:flex-row gap-6 items-end">
        {/* Playlist Cover */}
        <div className="w-full md:w-48 md:h-48 aspect-square rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
          <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
            {playlist.tracks.slice(0, 4).map((track, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${
                    track.artwork?.["150x150"] || track.artwork?.["480x480"]
                  })`,
                  backgroundSize: "cover",
                }}
              />
            ))}
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-2xl md:text-4xl font-bold bg-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdatePlaylist}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-base md:text-lg opacity-70 mb-4">
                  {playlist.description}
                </p>
              )}
              <button
                onClick={() => {
                  setEditName(playlist.name);
                  setEditDesc(playlist.description || "");
                  setIsEditing(true);
                }}
                className="text-green-500 hover:text-green-400 transition-colors text-sm md:text-base font-semibold"
              >
                Edit Details
              </button>
            </>
          )}
          <p className="text-xs md:text-sm opacity-60 mt-4">
            {playlist.tracks.length} song
            {playlist.tracks.length !== 1 ? "s" : ""} • Created{" "}
            {formatDate(playlist.createdAt)}
          </p>
        </div>
      </div>

      {/* Tracks Section */}
      {playlist.tracks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-700 flex items-center justify-center">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-slate-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              No tracks yet
            </h2>
            <p className="text-sm md:text-base opacity-60 max-w-md">
              Add songs from discover or search to get started
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Tracks</h2>
          <div className="space-y-2">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 md:p-4 rounded-lg hover:bg-slate-700 transition-colors group cursor-pointer ${
                  currentTrack?.id === track.id
                    ? "bg-green-500/20"
                    : "bg-slate-800"
                }`}
                onClick={() => handlePlayTrack(track.id)}
              >
                {/* Track number and art */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm opacity-60 w-6 flex-shrink-0">
                    {index + 1}
                  </span>
                  <img
                    src={
                      track.artwork?.["150x150"] || track.artwork?.["480x480"]
                    }
                    alt={track.title}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shrink-0"
                  />

                  {/* Track info */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm md:text-base truncate">
                      {track.title}
                    </p>
                    <p className="text-xs md:text-sm opacity-70 truncate">
                      {track.user?.name}
                    </p>
                  </div>
                </div>

                {/* Duration and actions */}
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                  <span className="text-xs opacity-60 shrink-0">
                    {track.duration && typeof track.duration === "number"
                      ? `${Math.floor(track.duration / 60)}:${String(
                          Math.floor(track.duration % 60),
                        ).padStart(2, "0")}`
                      : "--:--"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTrack(track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-600 rounded-lg transition-all flex-shrink-0"
                  >
                    <Play size={16} className="fill-current" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(playlist.id, track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
