import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../api/axios";
import type { Track } from "../../types/track";
import { ArrowLeft, Heart, Pause, Play, RotateCcw } from "lucide-react";
import { useFavorites } from "../../stores/useFavSong";
import { useLastPlayed } from "../../hooks/useLastPlayed";

const BASE_URL = "https://discoveryprovider.audius.co/v1";

const MusicDetails = () => {
  const { id } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {setLastPlayed}=useLastPlayed()
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tracks/${id}`);
        setTrack(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTrack();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const audio = new Audio(`${BASE_URL}/tracks/${id}/stream`);
    audioRef.current = audio;

    audio.onended = () => setPlaying(false);
    audio.ontimeupdate = () => setProgress(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [id]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
      if (track) {
        setLastPlayed(track);
      }
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    setPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
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
      {/*Mobile*/}
      <div className="flex flex-col lg:hidden">
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={artwork}
            alt=""
            className="w-full h-full object-cover scale-110 blur-sm opacity-60"
          />
          <div className="absolute inset-0 bg-black/30" />

          <button
            onClick={() => navigate(-1)}
            className="absolute z-10 top-4 left-4 text-white bg-black/30 p-2 rounded-full cursor-pointer"
          >
            <ArrowLeft className="size-5 cursor-pointer" />
          </button>

          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={artwork}
              alt=""
              className="w-52 h-52 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
        {/* Info + controls */}
        <div className="flex flex-col items-start gap-6 px-6 py-8">
          {/* Title + fav */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1 flex-1 mr-4">
              <h1 className="text-2xl font-black truncate">{track.title}</h1>
              <button
                className="text-gray-500 text-sm text-left hover:underline flex items-center gap-3 mt-3"
                onClick={() => {
                  const userId = (track.user as { id?: string })?.id;
                  if (userId) navigate(`/user/${userId}`);
                }}
              >
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={(track.user as any)?.profile_picture?.["150x150"]}
                />
                {track.user?.name}
              </button>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <div className="flex items-center gap-5">
              <button onClick={() => toggleFavorite(track)}>
                <Heart
                  className={`size-10 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
              <div>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={handleReplay}
                className="size-13 flex items-center justify-center rounded-full border border-gray-200 cursor-pointer"
              >
                <RotateCcw className="size-7 text-gray-600" />
              </button>

              <button
                onClick={handlePlayPause}
                className="size-13 rounded-full bg-black border flex items-center justify-center shadow-lg cursor-pointer"
              >
                {playing ? (
                  <Pause className="size-7 text-white" />
                ) : (
                  <Play className="size-7 text-white ml-1" />
                )}
              </button>

              <button
                className="cursor-pointer"
                onClick={() => {
                  const userId = (track.user as { id?: string })?.id;
                  if (userId) navigate(`/user/${userId}`);
                }}
              >
                <img
                  className="size-13 cursor-pointer rounded-full object-cover"
                  src={(track.user as any)?.profile_picture?.["150x150"]}
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        <div className="relative w-2/5 overflow-hidden">
          <img
            src={artwork}
            className="w-full h-full object-cover scale-110 blur-md opacity-50"
            alt=""
          />

          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={artwork}
              className="w-80 h-80 object-cover rounded-3xl shadow-2xl"
              alt=""
            />
          </div>

          <button
            className="absolute top-6 left-6 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-16 gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-black leading-tight">{track.title}</h1>
            <button
              className="text-gray-400 text-lg text-left hover:underline flex items-center gap-3 w-fit cursor-pointer"
              onClick={() => {
                const userId = (track.user as { id?: string })?.id;
                if (userId) navigate(`/user/${userId}`);
              }}
            >
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={(track.user as any)?.profile_picture?.["150x150"]}
                alt=""
              />
              {track.user?.name}
            </button>
          </div>

          {/* Genre / plays if available */}
          {(track as any).genre && (
            <span className="text-sm text-gray-400 uppercase tracking-widest">
              {(track as any).genre}
            </span>
          )}

          {/* Progress */}

          <div className="flex flex-col gap-2 w-full max-w-lg">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              {playing ? (
                <Pause className="size-7 text-white" />
              ) : (
                <Play className="size-7 text-white ml-1" />
              )}
            </button>

            <button
              onClick={handleReplay}
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
              <RotateCcw className="size-5 text-gray-600"/>
            </button>

            <button onClick={()=> toggleFavorite(track)}>
              <Heart className={`size-10 transition-colors ${
                  liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-600"
                }`}/>
            </button>

            <button
                className="cursor-pointer"
                onClick={() => {
                  const userId = (track.user as { id?: string })?.id;
                  if (userId) navigate(`/user/${userId}`);
                }}
              >
                <img
                  className="size-13 cursor-pointer rounded-full object-cover"
                  src={(track.user as any)?.profile_picture?.["150x150"]}
                  alt=""
                />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicDetails;
