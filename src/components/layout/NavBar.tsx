import { Menu, } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import { useTheme } from "../../stores/themeStores";
import { useAuthStore } from "../../stores/useAuthStore";

const NavBar = () => {
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkModeOn, toggleDarkMode } = useTheme();
  const [active, setActive] = useState<boolean>(false);
  const { clearToken } = useAuthStore();

  useEffect(() => {
    setActive(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="w-full h-20 border-b flex justify-between items-center p-2">
      <p className="sm:text-3xl text-xl my-3 font-bold ">Music App</p>

      <div className="gap-4 sm:flex hidden">
        <NavLink
          className={`w-full hover:bg-gray-600  font-semibold text-lg flex gap-3  transition-all duration-300 py-3 px-2 rounded-lg`}
          to={"/"}
        >
          {" "}
          Home
        </NavLink>

        <NavLink
          className={`w-full hover:bg-gray-600 text-lg font-semibold transition-all flex duration-300 py-3 px-2 gap-3 rounded-lg`}
          to={"/discover"}
        >
          Discover
        </NavLink>

        <NavLink
          className={`w-full hover:bg-gray-600 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
          to={"/favorite"}
        >
          {" "}
          Favorite
        </NavLink>

        <NavLink
          className={`w-full hover:bg-gray-600 text-lg font-semibold flex gap-3 transition-all duration-300 py-3 px-2 rounded-lg`}
          to={"/search"}
        >
          Search
        </NavLink>
      </div>

      <div className="sm:hidden flex">
        <Menu size={"30"} />
      </div>

      <div ref={dropdownRef} className={`relative sm:flex hidden`}>
        <button
          onClick={() => {
            setActive((prev) => !prev);
          }}
          className={`border size-16 rounded-full  flex  items-center justify-center cursor-pointer bg-white`}
        ></button>

        <div
          className={`w-70 absolute z-10 rounded-lg  right-0 top-16  p-1 flex flex-col gap-3 ${active ? "flex" : "hidden"} ${isDarkModeOn ? "bg-slate-800 text-white" : "bg-gray-100 text-black"}`}
        >
          <NavLink
            className={`block p-3 border-b hover:bg-gray-400 border-zinc-500 text-lg font-semibold transition-all duration-300 rounded-lg cursor-pointer`}
            to={"/profile"}
          >
            Profile
          </NavLink>

          <NavLink
            className={`block p-3 border-b hover:bg-gray-400 border-zinc-500 text-lg font-semibold transition-all duration-300 rounded-lg cursor-pointer`}
            to={"/setting"}
          >
            Setting
          </NavLink>

          <NavLink
            className={`block p-3 border-b hover:bg-gray-400 border-zinc-500 text-lg font-semibold transition-all duration-300 rounded-lg cursor-pointer`}
            to={"/login"}
            onClick={clearToken}
          >
            Log out
          </NavLink>

          <button
            onClick={toggleDarkMode}
            className="block p-3 border-b hover:bg-gray-400 border-zinc-500 text-lg text-start font-semibold transition-all duration-300 rounded-lg cursor-pointer"
          >
            DarkMode
          </button>

          <NavLink
            className={`block p-3 border-b hover:bg-gray-400 border-zinc-500 text-lg font-semibold transition-all duration-300 rounded-lg cursor-pointer`}
            to={"/help"}
          >
            Help
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
