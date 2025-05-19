import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { timeAgo } from "../../timeAgo";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import SavePost from "./SavePost";

export default function Post({ post }) {
  const [isDeliting, setIsDeliting] = useState(false);
  const postRef = useRef();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const edit = currentUser.uid === post.userId;

  if(!post || !post.id ){
    return;
  }

  function showUserPostsHandler() {
    navigate(`/user-profile/:${post.userId}`);
  }
  const profilePicture =
    post.profilePicture === undefined ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
    ) : (
      <img
        src={post.profilePicture}
        alt="Profile picture"
        className="w-12 h-12 rounded-full object-cover shadow-md"
      />
    );

  async function deletePostHandler(id) {
    try {
      setIsDeliting(true);
      // Brisanje samog posta
      await deleteDoc(doc(db, "PostsMeta", id));

      // Dohvati i obriši sve komentare tog posta
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", id)
      );
      const snapshot = await getDocs(commentsQuery);

      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "comments", docSnap.id))
      );

      await Promise.all(deletePromises);

      postRef.current.remove();
      setIsDeliting(false);
      console.log("Post i komentari uspešno obrisani:", id);
    } catch (error) {
      console.error("Greška prilikom brisanja posta i komentara:", error);
    }
  }

  return (
    <li
      ref={postRef}
      className="w-4/5 min-h-[140px] p-5  bg-gray-800 px-5 py-2 rounded-md"
    >
      <div className="w-full flex h-12 items-center m-2">
        <div className="w-9/10 flex gap-3 h-12 items-center m-2">
          {profilePicture}
          <h1
            onClick={showUserPostsHandler}
            className="text-xl text-white font-bold cursor-pointer"
          >
            {post.username}
          </h1>
          <p className="text-gray-500">{timeAgo(post.time)}</p>
        </div>
        {edit && (
          <button
            onClick={() => deletePostHandler(post.id)}
            className="text-xl p-1 px-3 rounded-md cursor-pointer hover:bg-black hover:opacity-40 text-white"
          >
            {isDeliting ? 'Deliting...' : 'Delete'}
          </button>
        )}
      </div>
      {post.imageUrl === "" ? (
        ""
      ) : (
        <img
          className="w-12/12 bg-amber-950 h-2/3 max-h-96 object-cover"
          src={post.imageUrl}
          alt=""
        />
      )}
      <div className="w-full min-h-10  p-3 flex items-center gap-2 ">
        {/* <h1 className="text-xl text-white font-bold">{post.username}:</h1> */}
        <p className="w-[100%] min-h-10 p-3  text-gray-400">
          {post.postContent}
        </p>
      </div>
      <div className="w-full min-h-15 p-5 flex items-center gap-3">
        <Comment post={post} />
        <SavePost post={post}/>
      </div>
    </li>
  );
}
