import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import Register from "./pages/Register";
import {action as registerUserAction} from './pages/Register'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Register />, action: registerUserAction  },
        { path: '/register', element: <Register />, action: registerUserAction },
        { path: "/home", element: <Home /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
