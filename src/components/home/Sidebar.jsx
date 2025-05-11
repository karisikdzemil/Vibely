import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faImage, faCircleUser, faMagnifyingGlass, faBookmark, faGear, faCircleQuestion, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar () {
    return(
        <ul className="w-[20%] h-[90vh] bg-gray-800 text-[#f5f5f5] flex flex-col justify-between p-5 pl-5 sticky top-20 rounded-r-3xl shadow-lg">
        {/* Gornji deo - Navigacija */}
        <div className="flex flex-col gap-4">
          <li className="text-2xl font-bold text-[#00bcd4] mb-2">
            <FontAwesomeIcon icon={faCircleUser} /> Djemsy
          </li>
          <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faHouse} /> Home
          </li>
          <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faImage} /> New Post
          </li>
          <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Explore
          </li>
          <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faBookmark} /> Saved
          </li>
        </div>
      
        {/* Srednji deo - Kratke informacije */}
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-gray-400 font-semibold">Your stats:</p>
          <p>👥 Followers: 124</p>
          <p>📝 Posts: 56</p>
          <p>❤️ Likes: 980</p>
        </div>
      
        {/* Donji deo - Shortcut sekcija */}
        <div className="flex flex-col gap-3 text-sm border-t border-gray-600 pt-3">
          <li className="cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faGear} /> Settings
          </li>
          <li className="cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faCircleQuestion} /> Help
          </li>
          <li className="cursor-pointer hover:text-red-400">
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </li>
        </div>
      </ul>
      
    )
}