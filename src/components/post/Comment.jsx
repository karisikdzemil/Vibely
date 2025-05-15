import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";


export default function Comment( {post} ) {
    const [isVisible, setIsVisible] = useState(false);
    function commentPostHandler () {
        setIsVisible(prevState => !prevState)
    }
  return (
    <div className="w-[100%] min-h-[5vh]">
    <div className="w-[100%] h-10 flex items-center gap-5">
    <p className="text-white text-center">
      <FontAwesomeIcon className="text-xl cursor-pointer" icon={faHeart} />{" "}
      <span className="mx-1">{post.likesCount}</span>{" "}
    </p>
    <button onClick={commentPostHandler} className="text-white">
      {/* <span className="mx-1"></span> */}
      <FontAwesomeIcon className="text-xl cursor-pointer" icon={faComment} />{" "}
    </button>
    </div>
    
   {isVisible && <div className="w-[100%] min-h-[10vh] pt-5 bg-red-400">
        <input className="w-9/12 h-10 pl-3 rounded-md bg-gray-500 text-white" type="text" placeholder="Enter something..." />
        <button className="w-25 h-10 rounded-md hover:bg-[#31a1b0] cursor-pointer bg-[#00bcd4]">Post</button>
    </div>}
    </div>
  );
}