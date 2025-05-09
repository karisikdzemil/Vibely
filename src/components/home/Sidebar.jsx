import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faImage } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar () {

    return(
        <ul className="w-[20%] h-[90vh] bg-gray-900 text-[#f5f5f5] flex flex-col gap-2 p-5 pl-15">
            <li className="text-[#00bcd4]"> <FontAwesomeIcon icon={faHouse} />  Home</li>
            <li><FontAwesomeIcon icon={faImage} />  New Post</li>
        </ul>
    )
}