import { useSelector, useDispatch } from "react-redux";
import RenderPosts from "../components/post/RenderPosts";
import Story from "../components/home/Story";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { setPosts } from "../store/posts-slice";
import Post from "../components/post/Post";
import { useMemo } from "react";
import Comment from "../components/post/Comment";
import Like from "../components/post/Like";

export default function Home() {
  const [loadingUsers, setLoadingUsers] = useState(true);
  const posts = useSelector((state) => state.posts);
  // const currentUser = useSelector((state) => state.user.user);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const loadingAuth = useSelector((state) => state.user.loadingAuth);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  console.log(currentUser)
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

  // const filteredPosts = useMemo(() => {
  //   if (!currentUser || users.length === 0) return [];
  
  //   const currentFetchedUser = users.find((user) => user.id === currentUser.uid);
  
  //   if (!currentFetchedUser) return [];
  
  //   return posts.filter((post) => {
  //     const author = users.find((u) => u.id === post.userId);
  //     if (!author) return false;
  
  //     // Ako je profil javan
  //     if (!author.profileVisibility) return true;
  
  //     // Ako ga current user prati
  //     return currentFetchedUser.following?.includes(author.id);
  //   });
  // }, [posts, users, currentUser]);

  
  

//   console.log("CURRENT USER:", currentUser);
// console.log("USERS:", users);
// console.log("POSTS:", posts);
// console.log("FILTERED POSTS:", filteredPosts);


  if (loadingAuth || loadingUsers || !posts.length) {
    return (
      <div className="flex flex-col items-center w-[60%]">
        <div className="flex gap-4 px-4 py-2 overflow-x-auto my-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-[60%] gap-6 px-4 py-2">
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
  console.log(filteredPosts)
  

  return (
    <section className="w-[60%] min-h-[90vh] dark:bg-gray-900 bg-gray-100">
      <div className="w-full min-h-[90vh] flex flex-col items-center p-5">
        <Story posts={filteredPosts} />
        <RenderPosts posts={filteredPosts} />
        {/* {filteredPosts.map(el => (
          <div>{el.postContent}</div>
        ))} */}
      </div>
    </section>
  );
}
