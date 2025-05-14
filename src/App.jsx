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

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch(userActions.setUser(JSON.parse(storedUser)));
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
        { path: "/profile", element: <Profile /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
