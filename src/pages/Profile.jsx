import { getDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../components/firebase";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import RenderPosts from "../components/post/RenderPosts";
import { useParams } from "react-router-dom";
import { collection, where, query, getDocs } from "firebase/firestore";




export default function Profile( ) {
  // const currentUser = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const allPosts = useSelector(state => state.posts);
  const {userId} = useParams();

  let currentUser = localStorage.getItem('user');
  currentUser = JSON.parse(currentUser);

  console.log(currentUser)
  
  useEffect(() => {
    async function getUser() {
      if (!userId) return;

      const userRef = doc(db, "Users", userId.replace(':', ''));

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

      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      console.log(postsData)
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

  if(userId.replace(/^:/, "") === currentUser.uid){
    console.log('isti su')
  }else{
    console.log('razliciti')
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
      <div className="w-4/5 min-h-80 m-auto bg-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg">
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
