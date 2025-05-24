import NewPost from "./NewPost";
import { useSelector, useDispatch } from "react-redux";
import RenderPosts from "../components/post/RenderPosts";
import Story from "../components/home/Story";

import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { setPosts } from "../store/posts-slice";


export default function Home() {
  
  const posts = useSelector(state => state.posts);
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
  

  return (
    <section className="w-[60%] min-h-[90vh] dark:bg-gray-900 bg-gray-100">
        <div className="w-[100%] min-h-[90vh] dark:bg-gray-900 bg-gray-100 flex flex-col items-center p-5">
      <Story />
          <RenderPosts posts={posts}/>
        </div>
    </section>
  );
}