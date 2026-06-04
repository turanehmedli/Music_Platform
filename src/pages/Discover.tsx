import { useEffect, useRef, useState } from "react";
import type { Track } from "../types/track";
import {
  getMultipleArtists,
  getRockTracks,
  getTrendingTracks,
} from "../api/tracks";
import CartTrending from "../components/home/CartTrending";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPopTracks } from "../api/tracks";
import CartArtist from "../components/home/CartArtist";
import { usePlayerStore } from "../stores/usePlayerStore";

// component içinde:
// const { setQueue, play } = usePlayerStore(); -- bunu SİL
// handlePlay'de direkt getState() kullan
import type { ReactNode } from "react";

const Discover = () => {
  const CartTrendingAny = CartTrending as unknown as (
    props: any,
  ) => ReactNode;
  const [trends, setTrends] = useState<Track[]>([]);
  const [pop, setPop] = useState<Track[]>([]);
  const [rock, setRock] = useState<Track[]>([]);
  const [artists, setArtists] = useState<
    Awaited<ReturnType<typeof getMultipleArtists>>
  >([]);
  const TrendRef = useRef<HTMLDivElement>(null);
  const PopRef = useRef<HTMLDivElement>(null);
  const RockRef = useRef<HTMLDivElement>(null);
  const ArtistRef = useRef<HTMLDivElement>(null);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsRes, popRes, rockRes, artists] = await Promise.all([
          getTrendingTracks(),
          getPopTracks(),
          getRockTracks(),
          getMultipleArtists([
            "Eminem",
            "Drake",
            "Kendrick",
            "justin-bieber",
            "The-Weeknd",
          ]),
        ]);
        setArtists(artists);
        setTrends(trendsRes);
        setPop(popRes);
        setRock(rockRes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handlePlay = (tracks: Track[], index: number) => {
  // Önce queue'yu doldur
  usePlayerStore.getState().setQueue(tracks, index);
  // Sonra play — artık queue dolu olacak
  usePlayerStore.getState().play(tracks[index]);
};

  const leftSmooth = () =>
    TrendRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const rightSmooth = () =>
    TrendRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  const leftPop = () =>
    PopRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const rightPop = () =>
    PopRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  const leftRock = () =>
    RockRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const rightRock = () =>
    RockRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  const leftArtist = () =>
    ArtistRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const rightArtist = () =>
    ArtistRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  return (
    <div className="w-full min-h-screen h-fit flex flex-col p-3 justify-center">
      {/* Trending */}
      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Trending</h2>
          <div className="flex gap-5 items-center">
            <button onClick={leftSmooth} className="cursor-pointer">
              <ArrowLeft size={30} />
            </button>
            <button onClick={rightSmooth} className="cursor-pointer">
              <ArrowRight size={30} />
            </button>
          </div>
        </div>
        <div
          ref={TrendRef}
          className="flex gap-10 overflow-x-auto scroll-smooth snap-x p-5 snap-mandatory scrollbar-hide"
        >
          {trends.map((data, index) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartTrendingAny
                item={data}
                onPlay={() => handlePlay(trends, index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pop */}
      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Pop</h2>
          <div className="flex gap-5 items-center">
            <button onClick={leftPop} className="cursor-pointer">
              <ArrowLeft size={30} />
            </button>
            <button onClick={rightPop} className="cursor-pointer">
              <ArrowRight size={30} />
            </button>
          </div>
        </div>
        <div
          ref={PopRef}
          className="flex gap-10 overflow-x-auto scroll-smooth snap-x p-5 snap-mandatory scrollbar-hide"
        >
          {pop.map((data, index) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartTrendingAny
                item={data}
                onPlay={() => handlePlay(pop, index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rock */}
      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Rock</h2>
          <div className="flex gap-5 items-center pb-3">
            <button onClick={leftRock} className="cursor-pointer">
              <ArrowLeft size={30} />
            </button>
            <button onClick={rightRock} className="cursor-pointer">
              <ArrowRight size={30} />
            </button>
          </div>
        </div>
        <div
          ref={RockRef}
          className="flex gap-10 overflow-x-auto scroll-smooth snap-x p-5 snap-mandatory scrollbar-hide"
        >
          {rock.map((data, index) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartTrendingAny
                item={data}
                onPlay={() => handlePlay(rock, index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Artist */}
      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Artist</h2>
          <div className="flex gap-5 items-center pb-3">
            <button onClick={leftArtist} className="cursor-pointer">
              <ArrowLeft size={30} />
            </button>
            <button onClick={rightArtist} className="cursor-pointer">
              <ArrowRight size={30} />
            </button>
          </div>
        </div>
        <div
          ref={ArtistRef}
          className="flex gap-10 overflow-x-auto scroll-smooth snap-x p-5 snap-mandatory scrollbar-hide"
        >
          {artists.map((data) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartArtist item={data as any} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
