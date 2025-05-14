import { Outlet, useLocation } from "react-router-dom";
import Header from "./pages/Header";
import Sidebar from "./components/home/sidebar";
import MoreInformation from "./components/home/MoreInformation";
export default function Layout () {
    const location = useLocation();

    // Stranice na kojima ne želiš da prikažeš Sidebar i ostale delove
    const hideLayoutPaths = ["/", "/register"];
  
    const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  
    return (
        <div>
            {!shouldHideLayout && <Header />}
            <main className="w-[100%] flex justify-between bg-gray-900">
             {!shouldHideLayout && <Sidebar />}
              <Outlet />
             {!shouldHideLayout && <MoreInformation />}
            </main>
        </div>
    )
}