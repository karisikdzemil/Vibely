import { Outlet } from "react-router-dom";
import Header from "./pages/Header";
import Sidebar from "./components/home/sidebar";
import MoreInformation from "./components/home/MoreInformation";
export default function Layout () {
    return (
        <div>
            <Header />
            <main className="w-[100%] flex justify-between bg-gray-900">
              <Sidebar />
              <Outlet />
              <MoreInformation />
            </main>
        </div>
    )
}