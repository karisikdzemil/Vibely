import { useSelector, useDispatch } from "react-redux";
import RenderPosts from "../components/post/RenderPosts";
import Story from "../components/home/Story";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { setPosts } from "../store/posts-slice";


export default function Home() {
  const [loadingUsers, setLoadingUsers] = useState(true);
  const posts = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.user.user);
  const loadingAuth = useSelector((state) => state.user.loadingAuth);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "PostsMeta");
        const snapshot = await getDocs(postsRef);
        const postsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setPosts(postsArray));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [dispatch]);

  if (loadingAuth || loadingUsers || !posts.length) {
    return (
      <div className="flex flex-col items-center lg:w-[60%] md:w-[90%] w-[100%]">
        <div className="flex max-w-full gap-4 px-4 py-2 overflow-x-auto my-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col lg:w-[60%] md:w-[90%] w-[100%] gap-6 px-4 py-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-md shadow p-4">
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
      </div>
    );
  }
  const filteredPosts = posts.filter((post) => {
    const currentFetchedUser = users.find((user) => user.id === currentUser.uid);
    const author = users.find((u) => u.id === post.userId);

    if (!currentFetchedUser || !author) return false;

    if (!author.profileVisibility) return true;

    return currentFetchedUser.following?.includes(author.id);
  });
  

  return (
    <section className="lg:w-[60%] md:w-[70%]  md:pb-0 pb-20 w-[100%] min-h-[90vh] dark:bg-gray-900 bg-gray-100">
      <div className="w-full min-h-[90vh] flex flex-col items-center p-5">
        <Story posts={filteredPosts} />
        <RenderPosts posts={filteredPosts} />
      </div>
    </section>
  );
}
