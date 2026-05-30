import { ArrowRight } from "lucide-react"
import CartTrending from "../components/home/CartTrending"
import { useFavorites } from "../stores/useFavSong"
import { NavLink } from "react-router"

const Favorite = () => {
  const {favorites} = useFavorites()
  return (
    <div className='w-full h-full flex-col p-5 flex'>
        <h2 className="text-4xl font-black mb-b">Favorite</h2>

        {
          favorites.length === 0 ?(
            <div className="flex flex-col h-screen items-center gap-3 mt-20 text-center">
              <p className="text-xl">No favorite song yet!</p>
            <p>Discover your favorite song now</p>
            <NavLink to={'/discover'} className="flex border p-3 gap-3 font-bold text-md items-center hover:shadow-lg hover:bg-gray-200 hover:-translate-y-1 active:translate-0 hover:text-black ease-in-out duration-200 cursor-pointer shadow-gray-400 rounded-lg">Discover <ArrowRight></ArrowRight></NavLink>
            </div>
          ):(
            <div className="grid grid-cols-3 min-h-screen h-fit gap-5 p-3">
              {
                favorites.map((track)=>(
                  <CartTrending key={track.id} item={track}/>
                ))
              }
              
            </div>
          )
        }
    </div>
  )
}

export default Favorite