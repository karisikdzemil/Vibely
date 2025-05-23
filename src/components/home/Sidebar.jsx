import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faImage, faCircleUser, faMagnifyingGlass, faBookmark, faGear, faCircleQuestion, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import ProfileActionInfo from "../profile/ProfileActionInfo";
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
// import { useParams } from "react-router-dom";

export default function Sidebar () {
  const user = useSelector(state => state.user.user);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  // const { userId } = useParams();
  const userId = user.uid;

  useEffect(() => {
    async function getData() {
      if (!userId) return;

      const cleanedUserId = userId.replace(/^:/, "");

      const postsRef = collection(db, "PostsMeta");
      const postsQuery = query(postsRef, where("userId", "==", cleanedUserId));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs);

      const followersRef = collection(db, "Followers");
      const followersQuery = query(followersRef, where("followingId", "==", cleanedUserId));
      const followersSnapshot = await getDocs(followersQuery);
      setFollowers(followersSnapshot.size);

      const followingQuery = query(followersRef, where("followerId", "==", cleanedUserId));
      const followingSnapshot = await getDocs(followingQuery);
      setFollowing(followingSnapshot.size);
    }

    getData();
  }, [userId]);

      if(!user){
        return;
      }

      const profilePicture =
      user.profilePicture === "" ? (
        <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
      ) : (
        <img
          src={user.profilePicture}
          alt="Profile picture"
          className="w-12 h-12 rounded-full object-cover shadow-md"
        />
      );
    
    return(
        <ul className="w-[20%] h-[90vh] bg-gray-800 text-[#f5f5f5] flex flex-col justify-between p-5 pl-5 sticky top-20 rounded-r-3xl shadow-lg">
        <div className="flex flex-col gap-4">
         <Link to={`/user-profile/:${user.uid}`}>
         <li className="w-full flex items-center gap-3 text-xl font-bold text-[#00bcd4] cursor-pointer mb-2">
            {profilePicture}{user && user.username}
          </li>
         </Link>
        <Link to='/home'>
        <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faHouse} /> Home
          </li>
        </Link>
        <Link to='/new-post'>
         <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faImage} /> New Post
          </li>
        </Link>
         
          <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Explore
          </li>
          <Link to='saved-posts'>
           <li className="text-lg cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faBookmark} /> Saved
          </li>
          </Link>
         
        </div>
      
        <div className="flex flex-col gap-3 text-sm">
              <p className="text-gray-400 font-semibold">Your stats:</p>
              <p>👥 Followers: {followers}</p>
              <p>👥 Following: {following}</p>
              <p>📝 Posts: {posts.length}</p>
            </div>
      
        <div className="flex flex-col gap-3 text-sm border-t border-gray-600 pt-3">
          <li className="cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faGear} /> Settings
          </li>
          <Link to='/help'>
            <li className="cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faCircleQuestion} /> Help
          </li>
          </Link>
        
          <li className="cursor-pointer hover:text-red-400">
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </li>
        </div>
      </ul>
      
    )
}