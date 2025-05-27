import { useSelector } from "react-redux";
import SuggestedFriends from "./SuggestedFriends";


export default function MoreInformation() {
  const currentUser = useSelector((state) => state.user.user);
  if (!currentUser) return null;

  return (
    <div className="w-[20%] h-[90vh] bg-gray-100 dark:bg-gray-900 sticky top-20 hidden lg:flex flex-col gap-5 p-4 rounded-l-2xl text-gray-900 dark:text-white">
      <SuggestedFriends />

      <div className="dark:bg-gray-800 bg-white p-3 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">Trending</h3>
        <ul className="text-sm space-y-1">
          <li>#React2025</li>
          <li>#WebDesign</li>
          <li>#CryptoNews</li>
        </ul>
      </div>

      <div className="dark:bg-gray-800 bg-white p-3 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-[#00bcd4]">
          Notifications
        </h3>
        <ul className="text-sm space-y-1">
          <li>🔔 Djemsy liked your post</li>
          <li>💬 New comment from Lara</li>
          <li>👤 You have 2 new followers</li>
        </ul>
      </div>
    </div>
  );
}
