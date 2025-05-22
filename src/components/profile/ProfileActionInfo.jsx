import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

export default function ProfileActionInfo() {
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const { userId } = useParams();


//   const user = useSelector(state => state.user.user);

  useEffect(() => {
    async function getData() {
      if (!userId) return;

      const cleanedUserId = userId.replace(/^:/, "");

      // Posts
      const postsRef = collection(db, "PostsMeta");
      const postsQuery = query(postsRef, where("userId", "==", cleanedUserId));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs);

      // Followers (ljudi koji prate korisnika)
      const followersRef = collection(db, "followers");
      const followersQuery = query(followersRef, where("followingId", "==", cleanedUserId));
      const followersSnapshot = await getDocs(followersQuery);
      setFollowers(followersSnapshot.size);

      // Following (ljudi koje korisnik prati)
      const followingQuery = query(followersRef, where("followerId", "==", cleanedUserId));
      const followingSnapshot = await getDocs(followingQuery);
      setFollowing(followingSnapshot.size);
    }

    getData();
  }, [userId]);

  return (
    <div className="w-[80%] h-[10vh] flex">
      <div className="w-1/3 h-full flex items-center justify-center flex-col">
        <h1 className="text-xl font-bold">{posts.length}</h1>
        <p>Posts</p>
      </div>
      <div className="w-1/3 h-full flex items-center justify-center flex-col">
        <h1 className="text-xl font-bold">{followers}</h1>
        <p>Followers</p>
      </div>
      <div className="w-1/3 h-full flex items-center justify-center flex-col">
        <h1 className="text-xl font-bold">{following}</h1>
        <p>Following</p>
      </div>
    </div>
  );
}
