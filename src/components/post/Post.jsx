import { useEffect, useRef, useState } from "react";
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
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import SavePost from "./SavePost";

export default function Post({ post }) {
  const [isDeleting, setIsDeleting] = useState(false);
  // const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const postRef = useRef();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  if (!post || !post.id || !currentUser || !currentUser.uid) {
    return null;
  }

  const edit = currentUser.uid === post.userId;

  const profilePicture =
    post.profilePicture === "" ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
    ) : (
      <img
        src={post.profilePicture}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover shadow-md"
      />
    );

  const showUserPostsHandler = () => {
    navigate(`/user-profile/:${post.userId}`);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Users", currentUser.uid), (docSnap) => {
      const data = docSnap.data();
      const userFollowing = data?.following || [];
      setIsFollowing(userFollowing.includes(post.userId));
    });

    return () => unsubscribe();
  }, [currentUser.uid, post.userId]);

  const handleFollowToggle = async () => {
    const userRef = doc(db, "Users", currentUser.uid);
    const followedUserRef = doc(db, "Users", post.userId);

    try {
      if (isFollowing) {
        await updateDoc(userRef, {
          following: arrayRemove(post.userId),
        });

        await updateDoc(followedUserRef, {
          followers: arrayRemove(currentUser.uid),
        });

        const q = query(
          collection(db, "Followers"),
          where("followerId", "==", currentUser.uid),
          where("followingId", "==", post.userId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnap) => {
          await deleteDoc(docSnap.ref);
        });
      } else {
        await updateDoc(userRef, {
          following: arrayUnion(post.userId),
        });

        await updateDoc(followedUserRef, {
          followers: arrayUnion(currentUser.uid),
        });

        await addDoc(collection(db, "Followers"), {
          followerId: currentUser.uid,
          followingId: post.userId,
          followedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Greška prilikom ažuriranja praćenja:", error);
    }
  };

  const deletePostHandler = async (id) => {
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "PostsMeta", id));

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
      setIsDeleting(false);
    } catch (error) {
      console.error("Greška prilikom brisanja posta i komentara:", error);
    }
  };

  return (
    <li
      ref={postRef}
      className="w-4/5 min-h-[140px] p-5 dark:bg-gray-800 bg-white px-5 py-2 rounded-md"
    >
      <div className="w-full flex h-12 items-center m-2 justify-between">
        <div className="flex gap-3 h-12 items-center m-2">
          {profilePicture}
          <h1
            onClick={showUserPostsHandler}
            className="text-xl dark:text-white text-gray-900 font-bold cursor-pointer"
          >
            {post.username}
          </h1>
          <p className="dark:text-gray-500 text-gray-700">{timeAgo(post.time)}</p>
        </div>

        {!edit && (
          <button
            onClick={handleFollowToggle}
            className="text-sm px-4 py-1 rounded-lg bg-[#00bcd4] text-white hover:bg-cyan-600 transition"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        {edit && (
          <button
            onClick={() => deletePostHandler(post.id)}
            className="text-sm px-3 py-1 rounded-lg cursor-pointer dark:text-white text-gray-900 hover:bg-black hover:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {post.imageUrl && (
        <img
          className="w-full max-h-96 object-cover my-3 rounded-md"
          src={post.imageUrl}
          alt="Post content"
        />
      )}

      <div className="w-full p-3">
        <p className="dark:text-gray-300 text-gray-900">{post.postContent}</p>
      </div>

      <div className="w-full min-h-15 p-5 flex items-center gap-3">
        <Comment post={post} />
        <SavePost post={post} />
      </div>
    </li>
  );
}
