import { useEffect, useRef, useState } from "react";
import type { Track } from "../types/track";
import { getRockTracks, getTrendingTracks } from "../api/tracks";
import CartTrending from "../components/home/CartTrending";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPopTracks } from "../api/tracks";

const Discover = () => {
  const [trends, setTrends] = useState<Track[]>([]);
  const [pop, setPop] = useState<Track[]>([]);
  const [rock, setRock] = useState<Track[]>([]);
  const TrendRef = useRef<HTMLDivElement>(null);
  const PopRef = useRef<HTMLDivElement>(null);
  const RockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsRes, popRes, rockRes] = await Promise.all([
          getTrendingTracks(),
          getPopTracks(),
          getRockTracks(),
        ]);

        setTrends(trendsRes);
        setPop(popRes);
        setRock(rockRes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const leftSmooth = () => {
    if (TrendRef.current) {
      TrendRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const rightSmooth = () => {
    if (TrendRef.current) {
      TrendRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  const leftPop = () => {
    if (PopRef.current) {
      PopRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const rightPop = () => {
    if (PopRef.current) {
      PopRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  const leftRock = () => {
    if (RockRef.current) {
      RockRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const rightRock = () => {
    if (RockRef.current) {
      RockRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full min-h-screen h-fit flex flex-col  p-3 justify-center ">
      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Trending</h2>

          <div className="flex gap-5  items-center">
            <button
              onClick={leftSmooth}
              className="cursor-pointer"
            >
              <ArrowLeft size={"30"} />
            </button>
            <button
              onClick={rightSmooth}
              className="cursor-pointer "
            >
              <ArrowRight size={"30"} />
            </button>
          </div>
        </div>
        <div
          ref={TrendRef}
          className="flex
          gap-10
          overflow-x-auto
          scroll-smooth
          snap-x
          p-5
          snap-mandatory
          scrollbar-hide"
        >
          {trends.map((data) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartTrending item={data} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Pop</h2>

          <div className="flex gap-5  items-center ">
            <button
              onClick={leftPop}
              className="cursor-pointer"
            >
              <ArrowLeft size={"30"} />
            </button>
            <button
              onClick={rightPop}
              className="cursor-pointer "
            >
              <ArrowRight size={"30"} />
            </button>
          </div>
        </div>
        <div
          ref={PopRef}
          className="flex
          gap-10
          overflow-x-auto
          scroll-smooth
          snap-x
          p-5
          snap-mandatory
          scrollbar-hide"
        >
          {pop.map((data) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartTrending item={data} />
            </div>
          ))}
        </div>
        
      </div>

      <div className="w-full p-1 flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="lg:text-4xl sm:2xl text-xl font-black">Rock</h2>

          <div className="flex gap-5  items-center pb-3">
            <button
              onClick={leftRock}
              className="cursor-pointer"
            >
              <ArrowLeft size={"30"} />
            </button>
            <button
              onClick={rightRock}
              className="cursor-pointer "
            >
              <ArrowRight size={"30"} />
            </button>
          </div>
        </div>
        <div
          ref={RockRef}
          className="flex
          gap-10
          overflow-x-auto
          scroll-smooth
          snap-x
          p-5
          snap-mandatory
          scrollbar-hide"
        >
          {rock.map((data) => (
            <div key={data.id} className="snap-start shrink-0">
              <CartTrending item={data} />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Discover;
