import { useFollowing } from "../stores/useFollowing";
import { useNavigate } from "react-router";

const Following = () => {
  const { following } = useFollowing();
  const navigate = useNavigate();

  return (
    <div className="p-5 w-full">
      <h1 className="text-3xl font-bold mb-6">
        Following Artists
      </h1>

      <div className=" gap-4">
        {following.map((artist) => (
          <div
            key={artist.id}
            onClick={() => navigate(`/user/${artist.id}`)}
            className="flex  items-center gap-3 p-4 rounded-xl bg-slate-800 justify-between cursor-pointer hover:bg-slate-700 transition"
          >
            <div className="flex items-center gap-3">
                <img
              src={artist.profile_picture?.["150x150"]}
              alt={artist.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <h3 className="font-semibold text-center">
              {artist.name}
            </h3>
            </div>

            <p className="text-sm opacity-60">
              {((artist.follower_count ?? 0) / 1000).toFixed(1)}K followers
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Following;