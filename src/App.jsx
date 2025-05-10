import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import Register from "./pages/Register";
import {action as registerUserAction} from './pages/Register'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user-slice";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        dispatch(userActions.setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Register />, action: registerUserAction  },
        { path: '/register', element: <Register />, action: registerUserAction },
        { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
