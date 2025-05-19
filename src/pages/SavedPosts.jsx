import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import Post from "../components/post/Post";
import RenderPosts from "../components/post/RenderPosts";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  let currentUser = localStorage.getItem("user");
  currentUser = JSON.parse(currentUser);
  console.log(currentUser.uid)

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

        // Dohvata sve postove koji imaju id u savedPostIds
        const postsRef = collection(db, "PostsMeta");
        const postsQuery = query(postsRef, where("__name__", "in", savedPostIds));
        const snapshot = await getDocs(postsQuery);

        const fetchedPosts = snapshot.docs.map(doc => ({
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
    return <h1 className="text-white text-2xl animate-pulse">Učitavanje...</h1>;
  }

  if (savedPosts.length === 0) {
    return <h1 className="text-white text-xl">Nema sačuvanih postova</h1>;
  }

  return (
    <div className="w-[100%] min-h-[90vh] bg-gray-900 flex flex-col items-center p-5">
        <RenderPosts posts={savedPosts}/>
    </div>
  );
}
