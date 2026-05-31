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
        const [trendsRes, popRes, rockRes ] = await Promise.all([
          getTrendingTracks(),
          getPopTracks(),
          getRockTracks(),
        ]);
        
        setTrends(trendsRes);
        setPop(popRes);
        setRock(rockRes)
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
      <div className="w-full p-3 flex flex-col gap-2">
        <h2 className="md:text-4xl sm:2xl text-xl font-black">Trending</h2>
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
        <div className="flex w-full justify-between items-center border-b pb-3">
          <button
            onClick={leftSmooth}
            className="my-3 border lg:p-3 p-2 rounded-2xl shadow"
          >
            <ArrowLeft size={"30"} />
          </button>
          <button
            onClick={rightSmooth}
            className="my-3 border lg:p-3 p-2 rounded-2xl shadow"
          >
            <ArrowRight size={"30"} />
          </button>
        </div>
      </div>

      <div className="w-full p-3 flex flex-col gap-2">
        <h2 className="md:text-4xl sm:2xl text-xl font-black">Pop</h2>
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
        <div className="flex w-full justify-between items-center border-b pb-3">
          <button
            onClick={leftPop}
            className="my-3 border lg:p-3 p-2 rounded-2xl shadow"
          >
            <ArrowLeft size={"30"} />
          </button>
          <button
            onClick={rightPop}
            className="my-3 border lg:p-3 p-2 rounded-2xl shadow"
          >
            <ArrowRight size={"30"} />
          </button>
        </div>
      </div>

       <div className="w-full p-3 flex flex-col gap-2">
        <h2 className="md:text-4xl sm:2xl text-xl font-black">Rock</h2>
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
        <div className="flex w-full justify-between items-center border-b pb-3">
          <button
            onClick={leftRock}
            className="my-3 border lg:p-3 p-2  rounded-2xl shadow"
          >
            <ArrowLeft size={"30"} />
          </button>
          <button
            onClick={rightRock}
            className="my-3 border lg:p-3 p-2 rounded-2xl shadow"
          >
            <ArrowRight size={"30"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
