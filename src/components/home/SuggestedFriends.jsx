import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SuggestedFriends () {
    const currentUser = useSelector((state) => state.user.user);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;
    
        const unsubscribe = onSnapshot(
          doc(db, "Users", currentUser.uid),
          (docSnap) => {
            const data = docSnap.data();
            setFollowing(data.following || []);
          }
        );
    
        return () => unsubscribe();
      }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
    
        async function fetchSuggestedUsers() {
          const snapshot = await getDocs(collection(db, "Users"));
          const users = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
              (user) => user.id !== currentUser.uid && !following.includes(user.id)
            );
    
          const randomSuggestions = users
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    
          setSuggestedUsers(randomSuggestions);
        }
    
        fetchSuggestedUsers();
      }, [currentUser, following]);

    const handleFollow = async (targetUserId) => {
        if (!currentUser || following.includes(targetUserId)) return;
    
        const userRef = doc(db, "Users", currentUser.uid);
    
        await updateDoc(userRef, {
          following: arrayUnion(targetUserId),
        });
    
        await addDoc(collection(db, "Followers"), {
          followerId: currentUser.uid,
          followingId: targetUserId,
          followedAt: serverTimestamp(),
        });
      };
    
      function showUserHandler(user) {
        if (!user) return;
        navigate(`/user-profile/:${user.id}`);
      }
    
    return(
        <div className="dark:bg-gray-800 bg-white p-3 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
          Suggested Friends
        </h3>
       
        <ul className="text-sm space-y-3">
        {suggestedUsers.length === 0 && (
          <li className="text-gray-400">No more users to suggest.</li>
        )}
        {suggestedUsers.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.profilePicture ? (
                <img
                  onClick={() => showUserHandler(user)}
                  src={user.profilePicture}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-2xl text-gray-400 cursor-pointer"
                  onClick={() => showUserHandler(user)}
                />
              )}
              <span
                className="cursor-pointer"
                onClick={() => showUserHandler(user)}
              >
                {user.username || "Unknown"}
              </span>
            </div>
            <button
              className="text-[#00bcd4] text-sm hover:underline cursor-pointer"
              onClick={() => handleFollow(user.id)}
            >
              {following.includes(user.id) ? "Following" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
      </div>

    )
}