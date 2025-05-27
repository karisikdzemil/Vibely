import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import SuggestedFriends from "./SuggestedFriends";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  // const [followers, setFollowers] = useState(0);
  // const [following, setFollowing] = useState(0);
  // const [postsCount, setPostsCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => setOpen(!open);

  const handleLogout = async () => {
    setLogout(true);
    await signOut(auth);
    localStorage.removeItem("user");
    dispatch(userActions.clearUser());
    setLogout(false);
    setOpen(false);
    navigate("/register");
  };

  // useEffect(() => {
  //   if (!user) return;

    // const getUserInfo = async () => {
    //   try {
    //     const userRef = doc(db, "users", user.id);
    //     const userSnap = await getDoc(userRef);
    //     if (userSnap.exists()) {
    //       const userData = userSnap.data();
    //       setFollowers(userData.followers?.length || 0);
    //       setFollowing(userData.following?.length || 0);
    //     }

    //     const postsRef = collection(db, "posts");
    //     const allPostsSnap = await getDocs(postsRef);
    //     const userPosts = allPostsSnap.docs.filter(
    //       (doc) => doc.data().userId === user.id
    //     );
    //     setPostsCount(userPosts.length);
    //   } catch (err) {
    //     console.error("Error loading user info:", err);
    //   }
    // };

  //   getUserInfo();
  // }, [user]);

  if (!user) return null;

  return (
    <>
      <button
        onClick={toggleMenu}
        className="text-2xl text-gray-700 dark:text-white md:hidden"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-[95vh] pb-10 w-72 bg-white dark:bg-gray-900 text-gray-800 dark:text-white z-50 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-5 relative">
          {/* X Button */}
          <button
            onClick={toggleMenu}
            className="absolute top-3 right-3 text-2xl text-gray-600 dark:text-gray-300"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">
              {user.username || "User Menu"}
            </h2>
           
          </div>

          <div className="py-10">
            <SuggestedFriends />
          </div>
          <div className="dark:bg-gray-800 mb-10 bg-white p-3 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
                Trending
              </h3>
              <ul className="text-sm space-y-1">
                <li>#React2025</li>
                <li>#WebDesign</li>
                <li>#CryptoNews</li>
              </ul>
            </div>

          <div className="mt-8 flex-1">
            <nav className="flex flex-col gap-5 text-base">
              <Link
                to="/settings"
                onClick={toggleMenu}
                className="hover:text-[#00bcd4] flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faGear} />
                Settings
              </Link>

              <Link
                to="/help"
                onClick={toggleMenu}
                className="hover:text-[#00bcd4] flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
                Help
              </Link>
            </nav>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              {logout ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
