// src/components/home/CartArtist.tsx

import { useNavigate } from "react-router";
import type { AudiusUser } from "../../types/users";
import { BadgeCheck } from "lucide-react";

type Props = {
  item: AudiusUser;
};

const CartArtist = ({ item }: Props) => {
    const navigate = useNavigate()
  const avatar =
    item.profile_picture?.["480x480"] ||
    item.profile_picture?.["150x150"] ||
    "";

  const formatCount = (n: number) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1) + "M"
      : n >= 1_000
      ? (n / 1_000).toFixed(1) + "K"
      : String(n);

  return (
    <div className="flex flex-col items-center gap-2 w-36 cursor-pointer group">
      
      <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/40 transition-all duration-300">
        {avatar ? (
          <img
          onClick={()=>{
            navigate(`/user/${item.id}`)
          }}
            src={avatar}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-2xl font-bold ">
            {item.name[0]}
          </div>
        )}
      </div>

      
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold truncate max-w-[100px]">
          {item.name}
        </span>
        {item.is_verified && (
          <BadgeCheck size={14} className="text-blue-400 shrink-0" />
        )}
      </div>

      
      <span className="text-xs text-neutral-400">@{item.handle}</span>

      
      <span className="text-xs text-neutral-500">
        {formatCount(item.follower_count)} followers
      </span>
    </div>
  );
};

export default CartArtist;