import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Camera, Check, Edit, X } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    handle: user?.handle || "",
    bio: user?.bio || "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ profile_picture: reader.result as any });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = ()=>{
    updateUser(form)
    setIsEditing(false)
  }

  const handleCancel =()=>{
    setForm({
      name:user?.name || "",
      handle:user?.handle || "",
      bio:user?.bio || "",
    });
    setIsEditing(false)
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen  max-w-2xl mx-auto py-10 px-4 flex flex-col gap-6">
      {/*Avatar + name */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={
              user.profile_picture?.["150x150"] ||
              `https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png`
            }
            alt="avatar"
            className="size-24 rounded-full object-cover border-4 border-sky-900"
          />
          <label className="absolute bottom-0 right-0 bg-sky-800 hover:bg-indigo-500 p-1 rounded-full cursor-pointer transition-colors">
            <Camera className="size-6 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {!isEditing ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-zinc-400 text-sm">@{user.handle}</p>
            <p className="text-zinc-400 text-sm">{user.bio || ""}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full max-w-sm">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-zinc-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-zinc-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Handle"
              value={form.handle}
              onChange={(e) => setForm({ ...form, handle: e.target.value })}
            />

            <textarea
              className="w-full px-3 py-2 rounded-lg border border-zinc-600 bg-transparent text-sm outline-none focus:ring-2 focus:ring-indigo-500  resize-none"
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
        )}

        {/*Edit/Save/Cancel buttons */}

        <div className="flex gap-2">
          {!isEditing?(
            <button onClick={()=> setIsEditing(true)} className="flex col-end-1 items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-500 text-sm font-medium transition-colors">
              <Edit className="size-4"/>
              Edit Profile
            </button>
          ):(
            <>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-medium transition-colors">
                <Check className="size-4"/>
                Save
              </button>
              <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium transition-colors">
                <X className="size-4"/>
                Cancel
              </button>
            </>
          )
          }
        </div>
      </div>

      {/*Follower / Follow */}
      <div className="flex justify-center gap-12 py-4 border-y border-zinc-600">
          <div className="flex flex-col items-center gap-1">
            
            <span className="text-xl font-bold">{user?.follower_count}</span>
            <span className="text-xs text-zinc-400">Following</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            
            <span className="text-xl font-bold">{user?.followee_count}</span>
            <span className="text-xs text-zinc-400">Following</span>
          </div>
      </div>
    </div>
  );
};

export default Profile;
