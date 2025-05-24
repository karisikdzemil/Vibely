import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faImage } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addPost } from "../store/posts-slice";
import { useDispatch } from "react-redux";

export default function NewPost() {
  const imageRef = useRef();
  const textRef = useRef();
  const user = useSelector((state) => state.user.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  console.log(user)

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
      profilePicture: user.profilePicture || '',
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
    return <p></p>
  }
  const profilePicture =
  user.profilePicture === "" ? (
    <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
  ) : (
    <img
      src={user.profilePicture}
      alt="Profile picture"
      className="w-14 h-14 rounded-full object-cover shadow-md"
    />
  );

  return (
    <div className="min-h-screen w-[60%] dark:bg-gray-900 bg-gray-100 dark:text-white texh-gray-900 flex items-start justify-center pt-20 px-4">
  <div className="w-full max-w-2xl dark:bg-gray-800 bg-white rounded-3xl shadow-2xl border border-cyan-600 p-8">
    
    <h2 className="text-3xl font-semibold text-cyan-400 mb-6 text-center">
      Create a New Post
    </h2>

    <div className="flex items-center gap-4 mb-6">
    {profilePicture}
      <input
        ref={textRef}
        type="text"
        placeholder={`What's on your mind, ${user.username}?`}
        className="flex-1 bg-transparent border-b-2 border-cyan-500 dark:text-white text-gray-900 text-xl px-2 py-2 focus:outline-none placeholder:text-gray-600 dark:placeholder:text-gray-400"
      />
    </div>

    {selectedImage && (
      <div className="mb-6">
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="w-full max-h-[500px] object-cover rounded-xl border border-cyan-500"
        />
      </div>
    )}

    <div className="flex justify-between items-center mt-4">
      <button
        onClick={chooseImageHandler}
        className="text-cyan-400 hover:text-cyan-300 text-lg flex items-center gap-2 transition"
      >
        <FontAwesomeIcon icon={faImage} />
        Add Photo
      </button>

      <input
        onChange={fileChangeHandler}
        ref={imageRef}
        type="file"
        className="hidden"
      />

      <button
        onClick={createPostHandler}
        className="bg-cyan-500 hover:bg-cyan-600 dark:text-white text-gray-900 font-semibold text-lg py-2 px-6 rounded-xl transition shadow-md hover:shadow-cyan-700/30"
      >
        Post
      </button>
    </div>
  </div>
</div>
  
  );
}
