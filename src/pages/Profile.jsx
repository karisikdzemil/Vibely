import { getDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../components/firebase";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import RenderPosts from "../components/post/RenderPosts";

export default function Profile() {
  const currentUser = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState(null);
  const allPosts = useSelector(state => state.posts);
  console.log(allPosts)

  const posts = allPosts.filter(el => el.userId === currentUser.uid);

  useEffect(() => {
    async function getUser() {
      if (!currentUser || !currentUser.uid) return;
      const userRef = doc(db, "Users", currentUser.uid);
      console.log(currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    }
    getUser();
  }, [currentUser]);

  if (!userData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white">
        <p>Loading profile...</p>
      </div>
    );
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

    console.log(userData)
    console.log(allPosts)
  return (
    <div className="w-6/10 min-h-screen p-8 text-white">
      <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg">
        {profilePicture}
        <h2 className="text-2xl font-semibold mt-4">{userData.username}</h2>
        <p className="text-gray-400">{userData.email}</p>
        <div className="mt-6 text-center w-full">
          <h3 className="text-xl font-medium text-[#00bcd4] mb-2">About</h3>
          <p className="text-gray-300">{userData.about}</p>
        </div>
      </div>
      <div>
      <RenderPosts posts={posts}/>
      </div>
    </div>
  );
}
