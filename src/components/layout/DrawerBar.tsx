import { Compass, Heart, Home, Music, Search, Settings } from "lucide-react";
import { NavLink } from "react-router";
import { useTheme } from "../../stores/themeStores";
import { useAuthStore } from "../../stores/useAuthStore";

const DrawerBar = () => {
  const { isDarkModeOn } = useTheme();
  const {localAvatar, user} = useAuthStore()
  
  const avatarSrc = localAvatar || user?.profile_picture?.["150x150"] || `https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png`;
  return (
    <div
      className={`w-60 p-5 flex flex-col gap-2  h-screen fixed ${isDarkModeOn ? "bg-slate-700 text-white" : "bg-white text-black"} left-0`}
    >
      <p className="text-3xl my-3 font-bold ">Music App</p>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold  flex gap-3  transition-all duration-300 py-3 px-2 rounded-lg`}
        to={"/"}
      >
        <Home size={"30"} /> Home
      </NavLink>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold transition-all flex duration-300 py-3 px-2 gap-3 rounded-lg`}
        to={"/discover"}
      >
        <Compass size={"30"} /> Discover
      </NavLink>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
        to={"/favorite"}
      >
        {" "}
        <Heart size={"30"} /> Favorite
      </NavLink>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
        to={"/search"}
      >
        {" "}
        <Search size={"30"} />
        Search
      </NavLink>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
        to={"/playlists"}
      >
        {" "}
        <Music size={"30"} />
        Playlist
      </NavLink>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
        to={"/profile"}
      >
        {" "}
        <img src={avatarSrc} className="size-[30px] rounded-full" alt="" />
        Profile
      </NavLink>

      <NavLink
        className={`w-full hover:bg-gray-400 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
        to={"/setting"}
      >
        {" "}
        <Settings size={"30"} />
        Settings
      </NavLink>

      <div className="w-full border-t my-2 py-3 border-zinc-300 "/>
    </div>
  );
};

export default DrawerBar;
