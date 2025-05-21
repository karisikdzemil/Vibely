import { useSelector, useDispatch } from "react-redux";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { addFollowing, removeFollowing } from "../../store/followers-slice";

export default function Follow({ post }) {
  const user = useSelector((state) => state.user.user);
  const followingUserIds = useSelector(
    (state) => state.followers.followingUserIds
  );
  const docIdsByUser = useSelector(
    (state) => state.followers.docIdsByUser
  );

  const dispatch = useDispatch();

  const isFollowing = followingUserIds.includes(post.userId);

  const followHandler = async () => {
    if (!user?.uid || !post?.userId || user.uid === post.userId) return;

    try {
      if (isFollowing) {
        const docId = docIdsByUser[post.userId];
        await deleteDoc(doc(db, "Followers", docId));
        dispatch(removeFollowing(post.userId));
      } else {
        const docRef = await addDoc(collection(db, "Followers"), {
          followerId: user.uid,
          followingId: post.userId,
          followedAt: new Date(),
        });
        dispatch(addFollowing({ followingId: post.userId, docId: docRef.id }));
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  if (user.uid === post.userId) return null; // ne prikazuj dugme ako gledaš svoj post

  return (
    <button
      onClick={followHandler}
      className="w-30 h-10 bg-black opacity-40 text-white cursor-pointer rounded-md hover:opacity-60 mr-3"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
