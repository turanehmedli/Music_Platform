import { Heart } from "lucide-react";
import type { Track } from "../../types/track";
import { useFavorites } from "../../stores/useFavSong";
import { useNavigate } from "react-router";

type CartTrendingProps = {
  item: Track;
};



const CartTrending = ({ item }: CartTrendingProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const liked = isFavorite(item.id);
  const navigate = useNavigate()
  

  return (
    <div onClick={(e)=>{
      e.preventDefault()
      navigate(`/discover/music/${item.id}`)
    }} className="lg:max-w-90 sm:max-w-60 max-w-40 w-full rounded flex flex-col gap-2 cursor-pointer items-center">
      <img
        className="lg:h-[300px] w-full object-cover"
        src={
          item.artwork?.["480x480"] ||
          item.artwork?.["150x150"] ||
          item.artwork?.["1000x1000"]
        }
      />

      <div className="flex w-full flex-col gap-2 py-2">
        <h3 className="text-xl font-semibold truncate">{item.title}</h3>
        <p>{item.user?.name}</p>
        <Heart
          className={`lg:size-9 cursor-pointer transition-colors ${
            liked ? "fill-red-600 text-red-600" : ""
          }`}
          onClick={(e) =>{
             e.stopPropagation() 
             toggleFavorite(item)
          }}
        />
      </div>
    </div>
  );
};

export default CartTrending;