import NewPost from "../components/home/NewPost";
import Sidebar from "../components/home/sidebar";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import Post from "../components/home/Post";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/posts-slice";
import MoreInformation from "../components/home/MoreInformation";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchPosts() {
      const postsRef = collection(db, "PostsMeta");
      const snapshot = await getDocs(postsRef);
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setPosts(postsArray));
    }
    fetchPosts();
  }, [dispatch]);
  const posts = useSelector(state => state.posts);

  console.log(posts)

  return (
    <section className="w-[60%] min-h-[90vh] bg-gray-900">
      <div className="w-[100%] min-h-[90vh] flex gap-5 ">
        <div className="w-[100%] min-h-[90vh] bg-gray-900 flex flex-col items-center p-5">
          <NewPost />
          <ul className="w-full flex flex-col items-center pt-10 gap-5">
            { posts && posts.map((el) => (
              <Post key={el.id} post={el} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
