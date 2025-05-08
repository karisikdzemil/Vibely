import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./pages/Header";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./Layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Signup /> },
        { path: '/signup', element: <Signup /> },
        { path: "/login", element: <Login /> },
        { path: "/home", element: <Home /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
