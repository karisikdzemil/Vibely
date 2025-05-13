import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faImage } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addPost } from "../../store/posts-slice";
import { useDispatch } from "react-redux";

export default function NewPost() {
  const imageRef = useRef();
  const textRef = useRef();
  const user = useSelector((state) => state.user.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); 
      console.log("Izabrana slika:", file.name);
    }
  };

  function chooseImageHandler() {
    imageRef.current.click();
  }

  async function createPostHandler() {
    if (!textRef.current.value.trim()) {
      alert("Post content is empty!");
      return;
    }

    let imageUrl = "";

    if (selectedImage) {
      const imageStorageRef = ref(storage, `postImages/${Date.now()}_${selectedImage.name}`);
      await uploadBytes(imageStorageRef, selectedImage);
      imageUrl = await getDownloadURL(imageStorageRef);
    }

    const postData = {
      userId: user.uid,
      username: user.username,
      userProfileImage: user.profilePicture || '',
      postContent: textRef.current.value,
      imageUrl: imageUrl,
      time: Date.now(),
      commentsCount: 0,
      likesCount: 0
    };

    const postRef = await addDoc(collection(db, "Posts"), postData);
    await addDoc(collection(db, "PostsMeta"), {
      postId: postRef.id,
      ...postData,
    });

    dispatch(addPost(postData))

    console.log("Post created with ID:", postRef.id);
    textRef.current.value = "";
    setSelectedImage(null);
  }

  if(!user || !user.username){
    return <p>Ceka se</p>
  }

  return (
    <div className="w-8/12 bg-gray-800 border rounded-2xl p-6 shadow-xl hover:shadow-cyan-600/20 transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <FontAwesomeIcon icon={faCircleUser} className="text-5xl text-cyan-400" />
      <input
        ref={textRef}
        type="text"
        placeholder={`What's on your mind, ${user.username}?`}
        className="flex-1 bg-transparent border-b border-cyan-500 text-white text-lg px-2 py-1 focus:outline-none placeholder:text-gray-400"
      />
    </div>
  
    {selectedImage && (
      <div className="mb-4">
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="w-full max-h-60 object-cover rounded-md border border-cyan-500"
        />
      </div>
    )}
  
    <div className="flex justify-between items-center">
      <button
        onClick={chooseImageHandler}
        className="text-cyan-400 hover:text-cyan-200 text-lg flex items-center gap-2 transition"
      >
        <FontAwesomeIcon icon={faImage} />
        Add Image
      </button>
  
      <input
        onChange={fileChangeHandler}
        ref={imageRef}
        className="hidden"
        type="file"
      />
  
      <button
        onClick={createPostHandler}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-5 rounded-lg transition"
      >
        Post
      </button>
    </div>
  </div>
  
  );
}
