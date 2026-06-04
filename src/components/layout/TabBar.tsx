import { NavLink } from "react-router"
import { useTheme } from "../../stores/themeStores"
import { Compass, Home, Search } from "lucide-react"
import { useAuthStore } from "../../stores/useAuthStore"
import { useEffect, useRef, useState } from "react"

const TabBar = () => {
  const { isDarkModeOn } = useTheme()
  const { localAvatar, user } = useAuthStore()
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  const avatarSrc = localAvatar || user?.profile_picture?.["150x150"] || `https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png`;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 10) {
        setVisible(true)
      } else if (currentY > lastScrollY.current) {
        setVisible(false) // aşağı kaydır → gizle
      } else {
        setVisible(true)  // yukarı kaydır → göster
      }
      lastScrollY.current = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className={`
      fixed w-full z-40 flex bottom-0 h-15
      items-center px-10 justify-between
      transition-transform duration-300
      ${visible ? "translate-y-0" : "translate-y-full"}
      ${isDarkModeOn ? "bg-slate-700 text-white" : "bg-gray-300 text-black"}
    `}>
      <NavLink className="flex flex-col items-center" to={'/'}>
        <Home className="size-6" />
        <p className="text-sm">Home</p>
      </NavLink>
      <NavLink className="flex flex-col items-center" to={'/discover'}>
        <Compass className="size-6" />
        <p className="text-sm">Discover</p>
      </NavLink>
      <NavLink className="flex flex-col items-center" to={'/search'}>
        <Search className="size-6" />
        <p className="text-sm">Search</p>
      </NavLink>
      <NavLink className="flex flex-col items-center" to={'/profile'}>
        <img src={avatarSrc} className="size-6 object-cover rounded-full" />
        <p className="text-sm">Profile</p>
      </NavLink>
      
    </div>
  )
}

export default TabBar