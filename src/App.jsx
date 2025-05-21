import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import Register from "./pages/Register";
import { action as registerUserAction } from "./pages/Register";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user-slice";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import { db } from "./components/firebase";
import { getDocs, collection } from "firebase/firestore";
import { setPosts } from "./store/posts-slice";
import NewPost from "./pages/NewPost";
import Help from "./pages/Help";
import SavedPosts from "./pages/SavedPosts";
import { fetchFollowing } from "./store/followers-slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch(userActions.setUser(JSON.parse(storedUser)));
      dispatch(fetchFollowing(storedUser.uid));
    }
  }, [dispatch]);

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Register />, action: registerUserAction },
        {
          path: "/register",
          element: <Register />,
          action: registerUserAction,
        },
        {
          path: "/home",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        { path: "/user-profile/:userId", element: <Profile /> },
        { path: "/new-post", element: <NewPost /> },
        { path: "/help", element: <Help /> },
        { path: "/saved-posts", element: <SavedPosts /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
