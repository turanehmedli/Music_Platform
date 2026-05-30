import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { AudiusUser } from "../../types/users";
import type { Track } from "../../types/track";
import { useFollowing } from "../../hooks/useFollowing";
import api from "../../api/axios";
import { ArrowLeft, Music } from "lucide-react";
import CartTrending from "./CartTrending";

const UserProfileP = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AudiusUser | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { follow, unfollow, isFollowing } = useFollowing();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const [userRes, tracksRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/users/${id}/tracks`),
        ]);
        setUser(userRes.data.data);
        setTracks(tracksRes.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  const followed = isFollowing(user.id);

  const handleFollow = () => {
    if (followed) {
      unfollow(user.id);
    } else {
      follow({
        id: user.id,
        name: user.name,
        profile_picture: user.profile_picture,
        follower_count: user.follower_count,
      });
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Cover photo */}
      <div className="relative w-full h-52 lg:h-72 overflow-hidden bg-gray-400 shrink-0">
        {user.cover_photo?.["2000x"] ? (
          <img
            className="w-full h-full object-cover"
            src={user.cover_photo["2000x"]}
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        >
          <ArrowLeft className="size-5" />
        </button>
      </div>

      {/* Profile section */}
      <div className="px-6 lg:px-16">
        {/* Avatar + follow row */}
        <div className="flex items-center justify-between mt-6  mb-4">
          <img src={
            user.profile_picture?.["480x480"] ||
            user.profile_picture?.["150x150"]
          }
          className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg" alt="" />

          <button onClick={handleFollow} className={`px-6 py-2 rounded-full cursor-pointer text-sm font-semibold transition mb-2 ${followed ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200":"bg-black text-white hover:bg-gray-800"} `}>
            {followed ? 'Following':'Follow'}
          </button>
        </div>

        <div className="flex it text-sm mb-4ems-center gap-2 mb-1">
          <h2 className="text-2xl font-black">{user.name}</h2>
          {user.is_verified && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Verified</span>
          )}
        </div>
        <p className="text-gray-400">@{user.handle}</p>

        <div className="flex gap-8 mb-6">
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">{user.track_count}</p>
            <p className="text-gray-400 text-xs">Tracks</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">
              {user.follower_count >= 1000
                ? `${(user.follower_count / 1000).toFixed(1)}K`
                : user.follower_count}
            </p>
            <p className="text-gray-400 text-xs">Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">
              {user.followee_count >= 1000
                ? `${(user.followee_count / 1000).toFixed(1)}K`
                : user.followee_count}
            </p>
            <p className="text-gray-400 text-xs">Following</p>
          </div>
        </div>

        {user.bio && (
          <p className="text-gray-600 text-sm max-w-xl mb-8 leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-black mb-4">Tracks</h2>

          {tracks.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center gap-2 text-gray-300">
              <Music className="size-10" />
              <p className="text-sm">No tracks yet</p>
            </div>
          ):(
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tracks.map((track)=> <CartTrending key={track.id} item={track}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileP;
