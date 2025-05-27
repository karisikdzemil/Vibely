import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/posts-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export default function Like ({post}) {
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.user);

    async function likePostHandler() {
        if(isLiking) return;

        setIsLiking(true);
      
        try {
            setIsLiked(prevState => !prevState);
          const likesRef = collection(db, "likes");
      
          const likeQuery = query(
            likesRef,
            where("postId", "==", post.id),
            where("userId", "==", currentUser.uid)
          );
          const snapshot = await getDocs(likeQuery);
      
          const postRef = doc(db, "PostsMeta", post.id);
      
          if (!snapshot.empty) {
            await Promise.all(snapshot.docs.map(docSnap =>
              deleteDoc(doc(db, "likes", docSnap.id))
            ));
      
            await updateDoc(postRef, {
              likesCount: increment(-1),
            });
          } else {
            await addDoc(likesRef, {
              postId: post.id,
              userId: currentUser.uid,
              createdAt: new Date().toISOString(),
            });
      
            await updateDoc(postRef, {
              likesCount: increment(1),
            });
          }
        dispatch(fetchPosts());

          setIsLiking(false);
        } catch (error) {
          console.error("Greška pri lajkovanju posta:", error);
        }
      }

async function checkIfUserLiked(postId, userId) {
  const likesRef = collection(db, "likes");
  const q = query(
    likesRef,
    where("postId", "==", postId),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty; 
}

useEffect(() => {
    async function checkLike() {
      const liked = await checkIfUserLiked(post.id, currentUser.uid);
      setIsLiked(liked); 
    }
  
    if (currentUser) checkLike();
  }, [post.id, currentUser]);
  
  return(
     <button onClick={likePostHandler} className="dark:text-white text-gray-900 text-center">
          <FontAwesomeIcon className={`text-xl cursor-pointer ${isLiked ? 'text-red-600' : ''}`} icon={faHeart} />{" "}
          <span className="mx-1">{post.likesCount}</span>{" "}
        </button>
  )
}