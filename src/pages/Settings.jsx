import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut, deleteUser, updatePassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { userActions } from "../store/user-slice";
import { toggleTheme } from "../store/theme-slice";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState("dark");
  const [privateProfile, setPrivateProfile] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const newPasswordRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if(!user){
    return;
  }

  const handleLogout = async () => {
      navigate("/register");
    await signOut(auth);
    localStorage.removeItem("user");
    dispatch(userActions.setUser(null));
  };

  const handleThemeChange = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    dispatch(toggleTheme())
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
    if (!confirmation) return;

    try {
      await deleteDoc(doc(db, "Users", user.uid));
      const currentUser = auth.currentUser;
      await deleteUser(currentUser);

      localStorage.removeItem("user");
      dispatch(userActions.setUser(null));
      navigate("/register");
    } catch (err) {
      console.error("Error deleting account:", err.message);
    }
  };

  const handlePasswordChange = async () => {
    const newPassword = newPasswordRef.current.value;
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);
      alert("Password updated successfully.");
      setShowPasswordForm(false);
    } catch (err) {
      alert("Error updating password: " + err.message);
    }
  };

  const saveSettings = async () => {
    try {
      await updateDoc(doc(db, "Users", user.uid), {
        profileVisibility: privateProfile  
      });
      alert("Settings saved.");
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    }
  };

  console.log(privateProfile)

  return (
    <div className="w-[60%] min-h-screen p-10 dark:text-white text-gray-900 dark:bg-gray-900 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">Settings</h1>

      <div className="dark:bg-gray-800 bg-white rounded-xl p-8 space-y-10 max-w-3xl mx-auto shadow-lg">

        <div>
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p className="dark:text-gray-300 text-gray-700">Username: <span className="font-bold">{user.username}</span></p>
          <p className="dark:text-gray-300 text-gray-700">Email: <span className="font-bold">{user.email}</span></p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <button 
            onClick={handleThemeChange}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Password</h2>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
            >
              Change Password
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                ref={newPasswordRef}
                type="password"
                placeholder="Enter new password"
                className="p-2 bg-gray-700 rounded"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Save New Password
              </button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={privateProfile}
              onChange={() => setPrivateProfile(!privateProfile)}
            />
            Private profile (hidden from public)
          </label>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={() => setEmailNotifs(!emailNotifs)}
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={pushNotifs}
              onChange={() => setPushNotifs(!pushNotifs)}
            />
            Push Notifications
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={saveSettings}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
          >
            Save Settings
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
