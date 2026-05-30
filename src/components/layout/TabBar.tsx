import { NavLink } from "react-router"
import { useTheme } from "../../stores/themeStores"
import { Compass, Home, Search, User } from "lucide-react"


const TabBar = () => {
  const {isDarkModeOn} = useTheme()
  return (
    <div className={`fixed w-full z-10 flex bottom-0 h-15 ${isDarkModeOn? "bg-slate-700 text-white":"bg-gray-300 text-black"}  items-center px-10 justify-between`}>
      <NavLink className={`flex flex-col items-center`} to={'/'}><Home className="size-6"/><p className="text-sm">Home</p></NavLink>
      <NavLink className={`flex flex-col items-center`} to={'/discover'}><Compass className="size-6"/><p className="text-sm">Discover</p></NavLink>
      <NavLink className={`flex flex-col items-center`} to={'/search'}><Search className="size-6"/><p className="text-sm">Search</p></NavLink>
      <NavLink className={`flex flex-col items-center`} to={'/profile'}><User className="size-6"/><p className="text-sm">Profile</p></NavLink>
    </div>
  )
}

export default TabBar