import NewPost from "../components/home/NewPost";
import Sidebar from "../components/home/sidebar";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import Post from "../components/home/Post";

export default function Home() {
    const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const postsRef = collection(db, "Posts");
      const snapshot = await getDocs(postsRef);
      const postsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsArray);
    }

    fetchPosts();
  }, []);
  return (
    <section className="w-[100%] min-h-[90vh] p-5 bg-[#121212]">
      <div className="w-[100%] h-12 bg-gray-900"></div>

      <div className="w-[100%] min-h-[90vh] flex gap-5 pt-5">
           <Sidebar />
           <div>
    </div>
        <div className="w-[60%] min-h-[90vh] bg-gray-900 flex flex-col items-center p-5">
            <NewPost />
            <ul className="w-full flex flex-col items-center pt-10 gap-5">
                {posts.map(el => (
                    <Post key={el.id} post={el}/>
                ))}
            </ul>
        </div>
        <div className="w-[20%] h-[90vh] bg-gray-900"></div>
      </div>

    </section>
  );
}
