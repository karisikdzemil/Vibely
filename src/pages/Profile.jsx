import { getDoc, doc } from "firebase/firestore";
// import { useSelector } from "react-redux";
import { db } from "../components/firebase";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import RenderPosts from "../components/post/RenderPosts";
import { useParams } from "react-router-dom";
import { collection, where, query, getDocs } from "firebase/firestore";

export default function Profile() {
  // const currentUser = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState();
  const [isEditing, setIsEditing] = useState(false);
  // const allPosts = useSelector(state => state.posts);
  const { userId } = useParams();

  let currentUser = localStorage.getItem("user");
  currentUser = JSON.parse(currentUser);

  console.log(currentUser);

  useEffect(() => {
    async function getUser() {
      if (!userId) return;

      const userRef = doc(db, "Users", userId.replace(":", ""));

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
      const cleanedUserId = userId.replace(/^:/, "");
      console.log("Tražim postove za userId:", cleanedUserId);

      const postsRef = collection(db, "PostsMeta");
      const q = query(postsRef, where("userId", "==", cleanedUserId));
      const snapshot = await getDocs(q);

      console.log("Broj postova:", snapshot.size);

      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      console.log(postsData);
    }
    getUser();
  }, [userId]);

  if (!userData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }
  let isCurrentUser = false;

  if (userId.replace(/^:/, "") === currentUser.uid) {
    isCurrentUser = true;
  }

  const profilePicture =
    userData.profilePicture === "" ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-8xl text-cyan-400" />
    ) : (
      <img
        src={userData.profilePicture}
        alt="Profile picture"
        className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
      />
    );

  function editUserHandler() {
    setIsEditing(true);
  }

  return (
    <div className="w-6/10 min-h-screen p-8 text-white">
      <div className="w-4/5 min-h-80 m-auto bg-gray-800 rounded-2xl p-6 flex flex-col items-center relative shadow-lg">
        {isCurrentUser && (
          <button
            onClick={editUserHandler}
            className="w-25 h-10 rounded-md hover:bg-[#31a1b0] cursor-pointer absolute right-10 top-10 bg-[#00bcd4]"
          >
            Edit
          </button>
        )}
        {!isEditing ? profilePicture : <div className="w-30 h-30 bg-gray-600 flex flex-col items-center justify-center gap-3"><h1 className="text-4xl text-white">+</h1> <p>Add Image</p></div>}
        {!isEditing ? (
          <h2 className="text-2xl font-semibold mt-4">{userData.username}</h2>
        ) : (
          <input className="w-3/5 h-7 bg-gray-600 pl-5 my-5" placeholder={userData.username} />
        )}
       {!isEditing ? <p className="text-gray-400">{userData.email}</p> : ''}
        <div className="mt-6 text-center w-full">
          <h3 className="text-xl font-medium text-[#00bcd4] mb-2">About</h3>
          {!isEditing ? (
            <p className="text-gray-300">{userData.about}</p>
          ) : (
            <textarea className="w-3/5 h-20 bg-gray-600 p-2 " placeholder={userData.about} />
          )}
        </div>
      </div>
      <div>
        <RenderPosts posts={posts} />
      </div>
    </div>
  );
}
