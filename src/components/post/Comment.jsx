import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
// import { useSelector } from "react-redux";
import Like from "./Like";

export default function Comment({ post }) {
  const [isVisible, setIsVisible] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const commentRef = useRef();
  const deleteCommentRef = useRef();
//   const currentUser = useSelector((state) => state.user.user);
let currentUser = localStorage.getItem("user");
currentUser = JSON.parse(currentUser);

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
        userImage: currentUser.profilePicture,
        createdAt: new Date().toISOString(),
      });

      const newComment = {
        id: docRef.id,
        comment: commentText,
        postId: post.id,
        userId: currentUser.uid,
        username: currentUser.username,
        userImage: currentUser.profilePicture,
        createdAt: new Date().toISOString(),
      };

      setAllComments((prevComments) => [newComment, ...prevComments]);
      commentRef.current.value = "";
    } catch (error) {
      console.error("Greška prilikom dodavanja komentara:", error);
    }
  }

  async function deleteCommentHandler (id) {
    try{
        await deleteDoc(doc(db, 'comments', id));
        deleteCommentRef.current.remove();
    }catch(error){
        console.log(error)
    }
    console.log(id)
  } 
  

  return (
    <div className="w-[100%] min-h-[5vh]">
      <div className="w-[100%] h-10 flex items-center gap-5">
        <Like post={post} />
        <button onClick={commentPostHandler} className="dark:text-white text-gray-900 cursor-pointer">
          <FontAwesomeIcon
            className="text-xl cursor-pointer"
            icon={faComment}
          />{" "}
        <span className="mx-1">{post.commentsCount}</span>
        </button>
      </div>

      {isVisible && (
        <div className="w-[100%] min-h-[10vh] pt-5">
          <input
            ref={commentRef}
            className="w-8/12 h-10 pl-3 rounded-md dark:bg-gray-600 bg-gray-300 mr-3 dark:text-white text-gray-900"
            type="text"
            placeholder="Enter something..."
          />
          <button
            onClick={setCommentHandler}
            className="w-25 h-10 rounded-md hover:bg-[#31a1b0] cursor-pointer bg-[#00bcd4]"
          >
            Post
          </button>
          <ul className="w-[100%] min-h-10 py-5">
            {allComments.map((el) => {
                const edit = currentUser.uid === el.userId;

              return <li ref={deleteCommentRef} className="w-full dark:bg-gray-700 bg-white rounded-lg shadow-md p-4 mb-3 flex justify-between items-center">
                <div>
                <div className="flex items-center mb-2">
                  <img
                    src={
                      el.userImage || (
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="text-4xl"
                        />
                      )
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="dark:text-white text-gray-900 font-semibold">
                      {el.username || "Anonimni korisnik"}
                    </h3>
                    <p className="text-sm dark:text-gray-400 text-gray-900">
                      {new Date(el.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="dark:text-gray-300 text-gray-900 text-base leading-relaxed break-words">
                  {el.comment}
                </p>
                </div>
                {edit && <button onClick={() => deleteCommentHandler(el.id)} className="text-red-500 rounded-md hover:bg-black hover:opacity-40 cursor-pointer w-20 h-10 ">Delete</button>}
              </li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}