import { Outlet, useLocation } from "react-router-dom";
import Header from "./pages/Header";
import Sidebar from "./components/home/sidebar";
import MoreInformation from "./components/home/MoreInformation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchFollowing } from "./store/followers-slice";
import { userActions } from "./store/user-slice";
export default function Layout () {

  const dispatch = useDispatch();

  
  dispatch(userActions.setUser(JSON.parse(localStorage.getItem('user')))); 

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    dispatch(userActions.setUser(parsedUser));              
    dispatch(fetchFollowing(parsedUser.uid));   
  } else {
    dispatch(userActions.setUser(null));
  }
}, [dispatch]);

  
    const location = useLocation();
    const hideLayoutPaths = ["/", "/register"];
  
    const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  
    return (
        <div>
            {!shouldHideLayout && <Header />}
            <main className="w-[100%] min-h-[90vh] flex justify-between dark:bg-gray-900 bg-gray-100">
             {!shouldHideLayout && <Sidebar />}
              <Outlet />
             {!shouldHideLayout && <MoreInformation />}
            </main>
        </div>
    )
}