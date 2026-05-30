import { NavLink } from "react-router"
import { useTheme } from "../../stores/themeStores"
import { Compass, Home, Search, User } from "lucide-react"


const TabBar = () => {
  const {isDarkModeOn} = useTheme()
  return (
    <div className={`fixed w-full z-10 flex bottom-0 h-15 ${isDarkModeOn? "bg-slate-700 text-white":"bg-gray-300 text-black"}  items-center px-10 justify-between`}>
      <NavLink to={'/'}><Home className="size-9"/></NavLink>
      <NavLink to={'/discover'}><Compass className="size-9"/></NavLink>
      <NavLink to={'/search'}><Search className="size-9"/></NavLink>
      <NavLink to={'/profile'}><User className="size-9"/></NavLink>
    </div>
  )
}

export default TabBar