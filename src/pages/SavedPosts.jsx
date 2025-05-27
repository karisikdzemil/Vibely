import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import RenderPosts from "../components/post/RenderPosts";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  let currentUser = localStorage.getItem("user");
  currentUser = JSON.parse(currentUser);

  useEffect(() => {
    async function fetchSavedPosts() {
      try {
        const userRef = doc(db, "Users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("Korisnik ne postoji");
          setLoading(false);
          return;
        }

        const savedPostIds = userSnap.data().savedPosts || [];

        if (savedPostIds.length === 0) {
          setSavedPosts([]);
          setLoading(false);
          return;
        }

        const postsRef = collection(db, "PostsMeta");
        const postsQuery = query(
          postsRef,
          where("__name__", "in", savedPostIds)
        );
        const snapshot = await getDocs(postsQuery);

        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedPosts(fetchedPosts);
      } catch (error) {
        console.error("Greška pri dohvatanju sačuvanih postova:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedPosts();
  }, [currentUser.uid]);

  if (loading) {
    return (
      <div className="flex  md:pb-0 pb-20 flex-col lg:w-[40%] md:w-[90%] w-[100%] gap-6 px-4 py-2">
          <h1 className="text-[#00bcd4] text-4xl font-bold m-auto">Saved Posts</h1>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-md shadow p-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="w-full h-64 bg-gray-300 animate-pulse rounded-md mb-4"></div>

            <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <h1 className="text-white my-10 text-2xl">Nema sačuvanih postova</h1>
    );
  }

  return (
    <div className="md:w-[60%] w-[100%] min-h-[100vh] dark:bg-gray-900 bg-gray-100 flex flex-col items-center p-5">
      <h1 className="text-[#00bcd4] text-4xl font-bold">Saved Posts</h1>
      <RenderPosts posts={savedPosts} />
    </div>
  );
}
