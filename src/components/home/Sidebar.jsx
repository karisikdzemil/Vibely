import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faImage,
  faCircleUser,
  faBookmark,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { db } from "../firebase";

export default function Sidebar() {
  // const user = useSelector((state) => state.user.user);  
  const user = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) return;
  
    const userId = user.uid;
  
    const getPosts = async () => {
      const postsRef = collection(db, "PostsMeta");
      const postsQuery = query(postsRef, where("userId", "==", userId));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs);
    };
  
    getPosts();
  
    const followersRef = collection(db, "Followers");
  
    const unsubscribeFollowers = onSnapshot(
      query(followersRef, where("followingId", "==", userId)),
      (snapshot) => {
        setFollowers(snapshot.size);
      }
    );
  
    const unsubscribeFollowing = onSnapshot(
      query(followersRef, where("followerId", "==", userId)),
      (snapshot) => {
        setFollowing(snapshot.size);
      }
    );
  
    return () => {
      unsubscribeFollowers();
      unsubscribeFollowing();
    };
  }, [user]); 

  if (!user) {
    return null;
  }

   const handleLogout = async () => {
    setLogout(true);
      await signOut(auth);
      localStorage.removeItem("user");
      dispatch(userActions.clearUser());
      setLogout(false);
      navigate('/register')
    };
  

  const profilePicture =
    user.profilePicture === "" ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
    ) : (
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover shadow-md"
      />
    );

  return (
    <ul className="lg:w-[20%] hidden md:w-[30%]  h-[90vh] dark:bg-gray-800 bg-white text-gray-900 dark:text-[#f5f5f5] md:flex flex-col justify-between p-5 pl-5 sticky top-20 rounded-r-3xl shadow-lg">
      <div className="flex flex-col gap-4">
        <Link to={`/user-profile/${user.uid}`}>
          <li className="w-full flex items-center gap-3 text-base lg:text-xl font-bold text-[#00bcd4] cursor-pointer mb-2">
            {profilePicture}
            {user.username}
          </li>
        </Link>

        <Link to="/home">
          <li className="lg:text-lg text-base cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faHouse} /> Home
          </li>
        </Link>

        <Link to="/new-post">
          <li className="lg:text-lg text-base cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faImage} /> New Post
          </li>
        </Link>

        <Link to="/saved-posts">
          <li className="lg:text-lg text-base cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faBookmark} /> Saved
          </li>
        </Link>
        <Link to={`/user-profile/${user.uid}`}>
         <li className="lg:text-lg text-base cursor-pointer hover:text-[#00bcd4]">
          <FontAwesomeIcon icon={faCircleUser} />  Profile
        </li>
        </Link>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <p className="dark:text-gray-400 text-gray-600 font-semibold">Your stats:</p>
        <p>👥 Followers: {followers}</p>
        <p>👥 Following: {following}</p>
        <p>📝 Posts: {posts.length}</p>
      </div>

      <div className="flex flex-col gap-3 text-sm border-t border-gray-600 pt-3">
        <Link to='/settings'>
        <li className="cursor-pointer hover:text-[#00bcd4]">
          <FontAwesomeIcon icon={faGear} /> Settings
        </li>
        </Link>
        <Link to="/help">
          <li className="cursor-pointer hover:text-[#00bcd4]">
            <FontAwesomeIcon icon={faCircleQuestion} /> Help
          </li>
        </Link>
        <button onClick={handleLogout} className="cursor-pointer hover:text-red-400">
          <FontAwesomeIcon icon={faRightFromBracket} /> {logout ? 'Loggin Out' : 'Logout'}
        </button>
      </div>
    </ul>
  );
}
