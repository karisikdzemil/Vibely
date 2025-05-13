import { getDoc, doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../components/firebase";
import { useState, useEffect } from "react";

export default function Profile() {
    const currentUser = useSelector((state) => state.user.user);
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      async function getUser() {
        if (!currentUser || !currentUser.uid) return; 
        const userRef = doc(db, 'Users', currentUser.uid);
        console.log(currentUser.uid)
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
    }
    
    getUser();
}, [currentUser]);
console.log(userData)
  
    return (
      <div className="w-full min-h-screen p-8 text-white">
        <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg">
          <img
            src={userData.imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
          />
          <h2 className="text-2xl font-semibold mt-4">{userData.username}</h2>
          <p className="text-gray-400">{userData.email}</p>
          <div className="mt-6 text-center w-full">
            <h3 className="text-xl font-medium text-[#00bcd4] mb-2">About</h3>
            <p className="text-gray-300">{userData.about}</p>
          </div>
        </div>
      </div>
    );
  }
  