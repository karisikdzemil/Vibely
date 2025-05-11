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
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
    }

    fetchPosts();
  }, []);
  return (
    <section className="w-[100%] min-h-[90vh] bg-gray-900">
      <div className="w-[100%] min-h-[90vh] flex gap-5 ">
        <Sidebar />
        <div></div>
        <div className="w-[60%] min-h-[90vh] bg-gray-900 flex flex-col items-center p-5">
          <NewPost />
          <ul className="w-full flex flex-col items-center pt-10 gap-5">
            {posts.map((el) => (
              <Post key={el.id} post={el} />
            ))}
          </ul>
        </div>
        <div className="w-[20%] h-[90vh] bg-gray-900 sticky top-20 flex flex-col gap-5 p-4 rounded-l-2xl text-white">
          <div className="bg-gray-800 p-3 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
              Suggested Friends
            </h3>
            <ul className="text-sm space-y-1">
              <li>
                👤 Marko Petrović{" "}
                <button className="text-[#00bcd4] ml-2">Follow</button>
              </li>
              <li>
                👤 Ana Jovanović{" "}
                <button className="text-[#00bcd4] ml-2">Follow</button>
              </li>
              <li>
                👤 Luka Milenković{" "}
                <button className="text-[#00bcd4] ml-2">Follow</button>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
              Trending
            </h3>
            <ul className="text-sm space-y-1">
              <li>#React2025</li>
              <li>#WebDesign</li>
              <li>#CryptoNews</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
              Notifications
            </h3>
            <ul className="text-sm space-y-1">
              <li>🔔 Djemsy liked your post</li>
              <li>💬 New comment from Lara</li>
              <li>👤 You have 2 new followers</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
