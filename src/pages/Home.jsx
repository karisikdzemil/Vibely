import { useSelector, useDispatch } from "react-redux";
import RenderPosts from "../components/post/RenderPosts";
import Story from "../components/home/Story";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import { setPosts } from "../store/posts-slice";


export default function Home() {
  
  const posts = useSelector(state => state.posts);
  const currentUser = useSelector(state => state.user.user)
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const usersData = querySnapshot.docs.map(doc => ({
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

  const filteredPosts = posts.filter(post => {
    const currentFetchedUser = users.find(user => user.id === currentUser.uid);
    console.log(currentFetchedUser)
    const author = users.find(u => u.id === post.userId);
    if (!author) return false;
    
    // Ako profil nije privatan, prikaži post
    if (!author.profileVisibility) return true;
  
    // Ako jeste privatan, prikaži samo ako currentUser prati tog autora
    // console.log(currentFetchedUser)

    return currentFetchedUser.following.includes(author.id);
  });
  

  console.log(filteredPosts)
  

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
      <Story posts={filteredPosts}/>
          <RenderPosts posts={filteredPosts}/>
        </div>
    </section>
  );
}