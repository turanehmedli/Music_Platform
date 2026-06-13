import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Camera, Check, Edit, Music, X } from "lucide-react";
import { useFollowing } from "../stores/useFollowing";

const Profile = () => {
  const {
    user,
    updateUser,
    localAvatar,
    localCover,
    updateAvatarProfile,
    updateCoverProfile,
  } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const { following } = useFollowing();
  const [form, setForm] = useState({
    name: user?.name || "",
    handle: user?.handle || "",
    bio: user?.bio || "",
  });

  const avatarSrc =
    localAvatar ||
    user?.profile_picture?.["480x480"] ||
    `https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png`;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateCoverProfile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateAvatarProfile(reader.result as any);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      handle: user?.handle || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Cover photo */}
      <div className="relative w-full h-52 lg:h-62 overflow-hidden shrink-0">
        {localCover || user.cover_photo?.["2000x"] ? (
          <img
            className="w-full h-full object-cover"
            src={localCover || user.cover_photo?.["2000x"]}
            alt=""
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {/* Cover dəyişdirmə düyməsi */}
        <label className="absolute bottom-3 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer transition">
          <Camera className="size-3.5" />
          Edit cover
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </label>
      </div>

      {/* Profile section */}
      <div className="px-6 lg:px-16">
        {/* Avatar + Edit button row */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-blue-700 hover:bg-blue-500 p-1.5 rounded-full cursor-pointer transition">
              <Camera className="size-4 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 rounded-full cursor-pointer text-sm font-semibold transition mb-2 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 flex items-center gap-1.5"
            >
              <Edit className="size-4" />
              Edit profile
            </button>
          ) : (
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                <Check className="size-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200 text-sm font-semibold transition cursor-pointer"
              >
                <X className="size-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Name / handle / bio */}
        {!isEditing ? (
          <>
            <div className="flex items-center gap-2 text-sm mb-1">
              <h2 className="text-2xl font-black">{user.name || "User"}</h2>
              {user.is_verified && (
                <span className="text-xs bg-blue-600 text-blue-100 size-5 items-center justify-center flex rounded-full font-medium">
                  <Check className="size-3 inline" />
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-1">@{user.handle || "username"}</p>
            {user.bio && (
              <p className="text-gray-600 text-sm max-w-xl mb-2 leading-relaxed">
                {user.bio}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2 max-w-sm mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-transparent text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-transparent text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="Handle"
              value={form.handle}
              onChange={(e) => setForm({ ...form, handle: e.target.value })}
            />
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-transparent text-sm outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Bio"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-8 mb-6">
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">0</p>
            <p className="text-gray-400 text-xs">Tracks</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">{user.follower_count ?? 0}</p>
            <p className="text-gray-400 text-xs">Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">{following.length}</p>
            <p className="text-gray-400 text-xs">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
