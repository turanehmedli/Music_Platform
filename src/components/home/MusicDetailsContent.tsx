import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import type { Track } from "../../types/track";
import {
  ArrowLeft,
  Heart,
  Pause,
  Play,
  Plus,
  RotateCcw,
  StepBack,
  StepForward,
} from "lucide-react";
import { useFavorites } from "../../stores/useFavSong";
import { useLastPlayed } from "../../stores/useLastPlayed";
import { usePlayerStore } from "../../stores/usePlayerStore";

type Props = { id: string; onClose?: () => void };

const MusicDetailsContent = ({ id, onClose }: Props) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setLastPlayed } = useLastPlayed();

  const {
    play,
    togglePlayPause,
    seek,
    progress,
    duration,
    playing,
    track: playerTrack,
  } = usePlayerStore();

  const isCurrentTrack = playerTrack?.id === track?.id;
  const isPlaying = isCurrentTrack && playing;
  const currentProgress = isCurrentTrack ? progress : 0;
  const currentDuration = isCurrentTrack ? duration : 0;

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
    track.artwork?.["1000x1000"] ||
    track.artwork?.["480x480"] ||
    track.artwork?.["150x150"];

  return (
    <div className="w-full min-h-screen flex flex-col">
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
          <div className="flex flex-col w-full gap-1 flex-1">
            <h1 className="sm:text-2xl text-md font-black truncate">
              {track.title}
            </h1>
            <button
              className="text-gray-500 text-sm text-left hover:underline flex items-center gap-3 mt-3"
              onClick={() => {
                const userId = (track.user as { id?: string })?.id;
                if (userId) navigate(`/user/${userId}`);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-3">
                  <img
                    className="w-6 h-6 rounded-full object-cover"
                    src={(track.user as any)?.profile_picture?.["150x150"]}
                  />
                  {track.user?.name}
                </div>

                <button onClick={() => toggleFavorite(track)}>
                  <Heart
                    className={`size-7 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>
              </div>
            </button>
          </div>

          <div className="flex gap-5 items-center w-full">
            <div className="flex items-center gap-5 flex-1">
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
          </div>

          <div className="w-full">
            <div className="flex items-center justify-center gap-8">
              <button onClick={handleReplay} className="cursor-pointer">
                <RotateCcw className="size-8 text-gray-600" />
              </button>
              <StepBack className="size-8 text-gray-600 cursor-pointer" />
              <button
                onClick={handlePlayPause}
                className="size-13 rounded-full bg-gray-50/20 border flex items-center justify-center shadow-lg cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="size-8 text-white" />
                ) : (
                  <Play className="size-8 text-white ml-1" />
                )}
              </button>
              <StepForward className="size-8 text-gray-600 cursor-pointer" />
              <button>
                <Plus className="size-8 text-gray-600 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="flex-col lg:flex hidden">
        <div className="relative w-full sm:h-[50vh] h-[30vh] overflow-hidden">
          <img
            src={artwork}
            alt=""
            className="w-full  object-cover scale-110 blur-sm opacity-60"
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
          <div className="flex flex-col gap-1 flex-1">
            <h1 className="sm:text-2xl text-md font-black truncate">
              {track.title}
            </h1>
            <button
              className="text-gray-500 text-sm text-left hover:underline flex items-center gap-3 mt-3"
              onClick={() => {
                const userId = (track.user as { id?: string })?.id;
                if (userId) navigate(`/user/${userId}`);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-3">
                  <img
                    className="w-6 h-6 rounded-full object-cover"
                    src={(track.user as any)?.profile_picture?.["150x150"]}
                  />
                  {track.user?.name}
                </div>

                <button onClick={() => toggleFavorite(track)}>
                  <Heart
                    className={`size-7 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>
              </div>
            </button>
          </div>

          <div className="flex gap-5 items-center w-full">
            <div className="flex items-center gap-5 flex-1">
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
          </div>

          <div className="w-full">
            <div className="flex items-center justify-center gap-8">
              <button onClick={handleReplay} className="cursor-pointer">
                <RotateCcw className="size-8 text-gray-600" />
              </button>
              <StepBack className="size-8 text-gray-600 cursor-pointer" />
              <button
                onClick={handlePlayPause}
                className="size-13 rounded-full bg-gray-50/20 border flex items-center justify-center shadow-lg cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="size-8 text-white" />
                ) : (
                  <Play className="size-8 text-white ml-1" />
                )}
              </button>
              <StepForward className="size-8 text-gray-600 cursor-pointer" />
              <button>
                <Plus className="size-8 text-gray-600 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicDetailsContent;
