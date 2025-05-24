import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faSearch,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

export default function Header() {
  const user = useSelector((state) => state.user.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const snapshot = await getDocs(collection(db, "Users"));
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (u) =>
          u.username?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  if (!user) return null;

  const profilePicture =
    user.profilePicture === "" ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-500" />
    ) : (
      <img
        src={user.profilePicture}
        alt="Profile picture"
        className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-[#00bcd4]"
      />
    );
  return (
    <header className="w-full h-[10vh] px-8 dark:bg-gray-800 bg-white shadow-lg border-b border-gray-700 sticky top-0 flex items-center justify-between z-50">
      <Link to="/home">
        <h1 className="text-[#00bcd4] text-2xl font-bold tracking-wider">
          Vibely
        </h1>
      </Link>

      <div className="w-1/3 relative">
        <input
          type="text"
          placeholder="Search Vibely..."
          className="w-full h-10 px-4 pl-10 rounded-full dark:bg-gray-700 bg-gray-300 dark:text-white text-gray-900 dark:placeholder-gray-400 placeholder-gray-700 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 dark:text-gray-400 text-gray-700"
        />

        {filteredUsers.length > 0 && (
          <ul className="absolute top-12 left-0 w-full dark:bg-gray-800 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredUsers.map((u) => (
              <li key={u.id}>
                <Link
                  to={`/user-profile/:${u.id}`}
                  className="flex items-center gap-3 px-4 py-2 dark:hover:bg-gray-700 hover:bg-gray-400 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                >
                  {u.profilePicture ? (
                    <img
                      src={u.profilePicture}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      className="text-4xl dark:text-gray-500 text-gray-800"
                    />
                  )}
                  <span className="dark:text-white text-gray-900">{u.username || u.email}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-6 dark:text-white text-gray-900 text-xl">
        <Link to="/new-post">
          <FontAwesomeIcon
            icon={faPlusSquare}
            className="cursor-pointer hover:text-[#00bcd4]"
          />
        </Link>
        <Link to={`/user-profile/:${user.uid}`}>{profilePicture}</Link>
      </div>
    </header>
  );
}
