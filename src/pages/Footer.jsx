import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPlusSquare,
  faBookmark,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-inner z-50 md:hidden">
      <ul className="flex justify-around items-center py-2 text-gray-700 dark:text-white text-xl">
        <Link to="/home">
          <li className="flex flex-col items-center hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faHouse} />
            <span className="text-xs">Home</span>
          </li>
        </Link>

        <Link to="/new-post">
          <li className="flex flex-col items-center hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faPlusSquare} />
            <span className="text-xs">Post</span>
          </li>
        </Link>

        <Link to="/saved-posts">
          <li className="flex flex-col items-center hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faBookmark} />
            <span className="text-xs">Saved</span>
          </li>
        </Link>

        <Link to={`/user-profile/${user.uid}`}>
          <li className="flex flex-col items-center hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faCircleUser} />
            <span className="text-xs">Profile</span>
          </li>
        </Link>
      </ul>
    </nav>
  );
}
