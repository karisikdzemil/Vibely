import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function SavePost( {post} ) {
    const [isSaved, setIsSaved] = useState(false);
    const user = useSelector(state => state.user.user)

    
    async function toggleSavePost(postId, userId) {
        console.log(userId)
      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);
    
        if (!userSnap.exists()) {
          console.error("Korisnik ne postoji");
          return;
        }
    
        const savedPosts = userSnap.data().savedPosts || [];
    
        const alreadySaved = savedPosts.includes(postId);
    
        await updateDoc(userRef, {
          savedPosts: alreadySaved
            ? arrayRemove(postId) 
            : arrayUnion(postId), 
        });
    
        setIsSaved(prev => !prev)
        return !alreadySaved;
      } catch (error) {
        console.error("Greška pri čuvanju posta:", error);
      }
    }
    
    return (
        <button onClick={() => toggleSavePost(post.id.replace(':', ''), user.uid)} className="text-xl text-white cursor-pointer">
            <FontAwesomeIcon className={isSaved ? `text-red-500` : ''}  icon={faBookmark} />
        </button>
    )
}