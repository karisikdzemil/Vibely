import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser, faImage } from "@fortawesome/free-solid-svg-icons"

export default function NewPost () {
    return(
    <div className="w-11/12 h-40 border-1 border-[#00bcd4] rounded-md p-5 flex flex-col justify-between">
       <div className="w-full h-10 flex gap-2">
       <p className="text-4xl text-white "><FontAwesomeIcon icon={faCircleUser} /></p>
       <input className="w-4/5 h-10 text-xl text-gray-400 pl-3" placeholder="What is on your mind Djemsy?" type="text" />
       </div>
       <div className="w-full h-10 flex gap-2 justify-between">
        <p className="text-white text-xl cursor-pointer"><FontAwesomeIcon icon={faImage} /> Add Image</p>   
        <button className="text-black bg-[#00bcd4] w-20 h-10 text-xl rounded-md font-bold cursor-pointer">Post</button>
       </div>
    </div>
    )
}