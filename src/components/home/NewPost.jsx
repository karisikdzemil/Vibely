import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser, faImage } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from "react-redux";

export default function NewPost () {
    const imageRef = useRef();
    const textRef = useRef();
    const user = useSelector(state => state.user.user);

    function createPostHandler () {
        console.log(user)
    }

    function chooseImageHandler () {
        imageRef.current.click();
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
          console.log("Izabrana slika:", file.name);
        //   ovde možeš da postaviš preview slike ili da je šalješ na server
        }
      };
    return(
    <div className="w-11/12 h-40 border-1 border-[#00bcd4] rounded-md p-5 flex flex-col justify-between">
       <div className="w-full h-10 flex gap-2">
       <p className="text-4xl text-white "><FontAwesomeIcon icon={faCircleUser} /></p>
       <input ref={textRef} className="w-4/5 h-10 text-xl text-gray-400 pl-3" placeholder="What is on your mind Djemsy?" type="text" />
       </div>
       <div className="w-full h-10 flex gap-2 justify-between">
        <p onClick={chooseImageHandler} className="text-white text-xl cursor-pointer"><FontAwesomeIcon icon={faImage} /> Add Image</p> 
        <input onChange={fileChangeHandler} ref={imageRef} className="hidden" type="file" />  
        <button onClick={createPostHandler} className="text-black bg-[#00bcd4] w-20 h-10 text-xl rounded-md font-bold cursor-pointer">Post</button>
       </div>
    </div>
    )
}