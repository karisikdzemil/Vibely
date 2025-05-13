import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope, faPlusSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
export default function Header () {

    return (
      <header className="w-full h-[10vh] px-8 bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 flex items-center justify-between z-50">
      <h1 className="text-[#00bcd4] text-2xl font-bold tracking-wider">
        Vibely
      </h1>
    
      <div className="w-1/3 relative">
        <input
          type="text"
          placeholder="Search Vibely..."
          className="w-full h-10 px-4 pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
        />
      </div>
    

      <div className="flex items-center gap-6 text-white text-xl">
        <FontAwesomeIcon icon={faBell} className="cursor-pointer hover:text-[#00bcd4]" />
        <FontAwesomeIcon icon={faEnvelope} className="cursor-pointer hover:text-[#00bcd4]" />
        <FontAwesomeIcon icon={faPlusSquare} className="cursor-pointer hover:text-[#00bcd4]" />
        <img
          src="https://i.pravatar.cc/150?img=32" 
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-[#00bcd4]"
        />
      </div>
    </header>
    
      
    )
}