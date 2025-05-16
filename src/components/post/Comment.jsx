import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/posts-slice";

export default function Comment( {post} ) {
    const [isVisible, setIsVisible] = useState(false);
    const [allComments, setAllComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const commentRef = useRef()
    const currentUser = useSelector(state => state.user.user);
    const dispatch = useDispatch();




    async function commentPostHandler() {
        setIsVisible((prevState) => !prevState);
      
        try {
          const commentsQuery = query(
            collection(db, "comments"),
            where("postId", "==", post.id)
          );
      
          const snapshot = await getDocs(commentsQuery);
      
          const comments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          setAllComments(comments);
        } catch (error) {
          console.error("Greška prilikom dohvatanja komentara:", error);
        }
      }

      async function setCommentHandler() {
        const commentText = commentRef.current.value.trim();
        if (!commentText) return;
      
        try {
          const docRef = await addDoc(collection(db, "comments"), {
            comment: commentText,
            postId: post.id,
            userId: currentUser.uid,
            username: currentUser.username,
            userImage: currentUser.image,
            createdAt: new Date().toISOString(),
          });
      
          const newComment = {
            id: docRef.id, // ručno dodaješ ID koji ti je Firestore vratio
            comment: commentText,
            postId: post.id,
            userId: currentUser.uid,
            username: currentUser.username,
            userImage: currentUser.image,
            createdAt: new Date().toISOString(),
          };
      
          setAllComments(prevComments => [newComment, ...prevComments]);
          commentRef.current.value = "";
        } catch (error) {
          console.error("Greška prilikom dodavanja komentara:", error);
        }
      }

      
      async function likePostHandler() {
        if (!currentUser) return alert("Morate biti ulogovani da biste lajkovali post!");
      
        try {
            setIsLiked(prevState => !prevState);
          const likesRef = collection(db, "likes");
      
          // Proveri da li korisnik već lajkovao post
          const likeQuery = query(
            likesRef,
            where("postId", "==", post.id),
            where("userId", "==", currentUser.uid)
          );
          const snapshot = await getDocs(likeQuery);
      
          const postRef = doc(db, "PostsMeta", post.id); // referenca na post
      
          if (!snapshot.empty) {
            // Već lajkovao – ukloni lajk i smanji counter
            await Promise.all(snapshot.docs.map(docSnap =>
              deleteDoc(doc(db, "likes", docSnap.id))
            ));
      
            await updateDoc(postRef, {
              likesCount: increment(-1),
            });
          } else {
            // Nije lajkovao – dodaj lajk i povećaj counter
            await addDoc(likesRef, {
              postId: post.id,
              userId: currentUser.uid,
              createdAt: new Date().toISOString(),
            });
      
            await updateDoc(postRef, {
              likesCount: increment(1),
            });
          }
        dispatch(fetchPosts())
      
        } catch (error) {
          console.error("Greška pri lajkovanju posta:", error);
        }
      }
      

  return (
    <div className="w-[100%] min-h-[5vh]">
    <div className="w-[100%] h-10 flex items-center gap-5">
    <button onClick={likePostHandler} className="text-white text-center">
      <FontAwesomeIcon className={`text-xl cursor-pointer ${isLiked ? 'text-red-600' : ''}`} icon={faHeart} />{" "}
      <span className="mx-1">{post.likesCount}</span>{" "}
    </button>
    <button onClick={commentPostHandler} className="text-white">
      {/* <span className="mx-1"></span> */}
      <FontAwesomeIcon className="text-xl cursor-pointer" icon={faComment} />{" "}
    </button>
    </div>
    
   {isVisible && <div className="w-[100%] min-h-[10vh] pt-5">
        <input ref={commentRef} className="w-8/12 h-10 pl-3 rounded-md bg-gray-600 mr-3 text-white" type="text" placeholder="Enter something..." />
        <button onClick={setCommentHandler} className="w-25 h-10 rounded-md hover:bg-[#31a1b0] cursor-pointer bg-[#00bcd4]">Post</button>
        <ul className="w-[100%] min-h-10 py-5">
            {allComments.map(el => (

                <li className="w-full bg-gray-700 rounded-lg shadow-md p-4 mb-3">
                <div className="flex items-center mb-2">
                  <img
                    src={el.userImage || <FontAwesomeIcon icon={faCircleUser} className="text-4xl"/>}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{el.username || "Anonimni korisnik"}</h3>
                    <p className="text-sm text-gray-400">{new Date(el.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-base leading-relaxed break-words">{el.comment}</p>
              </li>
              
            ))}
        </ul>
    </div>}
    </div>
  );
}