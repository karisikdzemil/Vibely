import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SavePost( {post} ) {
    const [isSaved, setIsSaved] = useState(false);
    // const [fetchedUser, setFetchedUser] = useState({});
    const user = useSelector(state => state.user.user)


    useEffect(() => {
        async function fetchUser(id) {
          try {
            const userRef = doc(db, "Users", id);
            const userSnap = await getDoc(userRef);
    
            if (userSnap.exists()) {
              const data = userSnap.data();
              console.log(data)
              const isInSaved = data.savedPosts?.includes(post.id.replace(':', ''));
              setIsSaved(isInSaved);
                
            } else {
              console.log("Korisnik ne postoji.");
            }
          } catch (error) {
            console.error("Greška prilikom dohvatanja korisnika:", error);
          }
        }
    
        if (user?.uid) {
          fetchUser(user.uid);
        }
      }, [user.uid]);

    async function toggleSavePost(postId, userId) {
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
            <FontAwesomeIcon className={isSaved ? `text-yellow-400` : ''}  icon={faBookmark} />
        </button>
    )
}