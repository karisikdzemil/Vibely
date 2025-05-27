import { getDoc, doc } from "firebase/firestore";
import { db, storage } from "../components/firebase";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import RenderPosts from "../components/post/RenderPosts";
import { useParams } from "react-router-dom";
import {
  collection,
  where,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import ProfileActionInfo from "../components/profile/ProfileActionInfo";
import { addDoc } from "firebase/firestore";
import { addFollowing } from "../store/followers-slice";
import { arrayUnion } from "firebase/firestore";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const inputImageRef = useRef();
  const userRef = useRef();
  const aboutRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useParams();
  const dispatch = useDispatch();

  let currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function getUser() {
      if (!userId) return;
      const userRef = doc(db, "Users", userId.replace(":", ""));
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      const cleanedUserId = userId.replace(/^:/, "");
      const postsRef = collection(db, "PostsMeta");
      const q = query(postsRef, where("userId", "==", cleanedUserId));
      const snapshot = await getDocs(q);

      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    }
    getUser();
  }, [userId]);

  useEffect(() => {
    async function checkPrivacyAndFollow() {
      if (!userData || !currentUser?.uid) return;

      const isOwner = currentUser.uid === userId.replace(/^:/, "");

      if (userData.profileVisibility && !isOwner) {
        // Provera da li korisnik već prati
        const q = query(
          collection(db, "Followers"),
          where("followerId", "==", currentUser.uid),
          where("followingId", "==", userId.replace(/^:/, ""))
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setIsFollowing(true);
          setIsPrivate(false);
        } else {
          setIsPrivate(true);
        }
      } else {
        setIsPrivate(false);
      }
    }

    checkPrivacyAndFollow();
  }, [userData]);

  if (!userData) {
    return (
      <div className="lg:w-2/5 md:w-3/5 w-9/10 min-h-80 m-auto dark:bg-gray-800 bg-white rounded-2xl p-6 flex flex-col items-center relative shadow-lg animate-pulse">
        <div className="w-24 h-10 bg-gray-300 rounded absolute right-10 top-10" />
        <div className="w-24 h-24 bg-gray-300 rounded-full mt-4" />
        <div className="w-40 h-6 bg-gray-300 rounded mt-4" />
        <div className="w-56 h-4 bg-gray-300 rounded mt-2" />
        <div className="flex gap-6 mt-4">
          <div className="w-16 h-4 bg-gray-300 rounded" />
          <div className="w-16 h-4 bg-gray-300 rounded" />
          <div className="w-16 h-4 bg-gray-300 rounded" />
        </div>
        <div className="mt-6 text-center w-full">
          <div className="w-24 h-5 bg-gray-300 rounded mx-auto mb-2" />
          <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto mb-1" />
          <div className="w-1/2 h-4 bg-gray-300 rounded mx-auto" />
        </div>
      </div>
    );
  }

  const isCurrentUser = userId.replace(/^:/, "") === currentUser.uid;

  const profilePicture = !isEditing ? (
    userData.profilePicture === "" ? (
      <FontAwesomeIcon icon={faCircleUser} className="text-8xl text-cyan-400" />
    ) : (
      <img
        src={userData.profilePicture}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
      />
    )
  ) : previewUrl ? (
    <img
      src={previewUrl}
      alt="Preview"
      className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
    />
  ) : (
    <div
      onClick={chooseImageHandler}
      className="cursor-pointer w-32 h-32 bg-gray-600 flex flex-col items-center justify-center gap-3 rounded-full"
    >
      <h1 className="text-4xl text-white">+</h1>
      <p className="text-sm">Add Image</p>
    </div>
  );

  function chooseImageHandler() {
    inputImageRef.current.click();
  }

  function imageInputHandler(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function editUserHandler() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const enteredUsername = userRef.current?.value.trim();
    const enteredAbout = aboutRef.current?.value.trim();

    let isValid = true;

    if (enteredUsername && enteredUsername.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (enteredAbout && enteredAbout.length < 3) {
      setAboutError("About must be at least 3 characters.");
      isValid = false;
    } else {
      setAboutError("");
    }

    if (!isValid) return;

    try {
      let imageUrl = userData.profilePicture;

      if (selectedImage && selectedImage instanceof File) {
        const imageRef = ref(
          storage,
          `userImages/${currentUser.uid}_${Date.now()}`
        );
        await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const changedUser = {
        username: enteredUsername || userData.username,
        about: enteredAbout || userData.about,
        email: currentUser.email,
        profilePicture: imageUrl,
      };

      const userDocRef = doc(db, "Users", currentUser.uid);
      await updateDoc(userDocRef, changedUser);

      const postsQuery = query(
        collection(db, "PostsMeta"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(postsQuery);

      const updatePostPromises = snapshot.docs.map((docSnap) => {
        const postRef = doc(db, "PostsMeta", docSnap.id);
        return updateDoc(postRef, {
          username: changedUser.username,
          profilePicture: changedUser.profilePicture,
        });
      });

      await Promise.all(updatePostPromises);

      const updatedUser = { ...currentUser, ...changedUser };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch(userActions.setUser(updatedUser));
      setUserData(updatedUser);
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  async function handleFollow() {
    try {
      const followingId = userId.replace(/^:/, "");

      const userRef = doc(db, "Users", currentUser.uid);
      await updateDoc(userRef, {
        following: arrayUnion(followingId),
      });

      const followedUserRef = doc(db, "Users", followingId);
      await updateDoc(followedUserRef, {
        followers: arrayUnion(currentUser.uid),
      });

      const newFollow = {
        followerId: currentUser.uid,
        followingId: followingId,
        followedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "Followers"), newFollow);

      setIsFollowing(true);
      setIsPrivate(false);

      dispatch(addFollowing({ followingId: followingId, docId: docRef.id }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  }

  return (
    <div className="lg:w-6/10 md:w-9/10 w-full  md:pb-0 pb-20 dark:bg-gray-900 bg-gray-100 min-h-screen p-8 dark:text-white text-gray-900">
      {
        <div className="sm:w-4/5 w-full min-h-80 m-auto dark:bg-gray-800 bg-white rounded-2xl p-6 flex flex-col items-center relative shadow-lg">

            {isCurrentUser && (
              <button
              onClick={editUserHandler}
              className="md:w-25 w-15 md:h-10 h-7 rounded-md hover:bg-[#31a1b0] absolute right-5 cursor-pointer bg-[#00bcd4]"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            )}

            {profilePicture}

          {!isEditing ? (
            <h2 className="text-2xl font-semibold mt-4">{userData.username}</h2>
          ) : (
            <div className="w-3/5 flex flex-col my-4">
              <input
                ref={userRef}
                className="h-7 dark:bg-gray-600 bg-gray-300 pl-5 rounded"
                placeholder={userData.username}
              />
              {usernameError && (
                <p className="text-red-400 text-sm mt-1">{usernameError}</p>
              )}
            </div>
          )}

          {!isEditing ? (
            <p className="dark:text-gray-400 text-gray-700">{userData.email}</p>
          ) : (
            ""
          )}
          <ProfileActionInfo />

          <div className="mt-6 text-center w-full">
            <h3 className="text-xl font-medium text-[#00bcd4] mb-2">About</h3>
            {!isEditing ? (
              <p className="dark:text-gray-300 text-gray-700">
                {userData.about}
              </p>
            ) : (
              <div className="w-3/5 flex flex-col m-auto">
                <textarea
                  ref={aboutRef}
                  className="h-20 dark:bg-gray-600 bg-gray-300 p-2 rounded"
                  placeholder={userData.about}
                />
                {aboutError && (
                  <p className="text-red-400 text-sm mt-1">{aboutError}</p>
                )}
              </div>
            )}
          </div>

          <input
            onChange={imageInputHandler}
            ref={inputImageRef}
            type="file"
            className="hidden"
          />
        </div>
      }

      <div className="mt-10">
        {isPrivate ? (
          <div className="text-center p-6 bg-gray-700 text-white rounded-xl">
            <p className="text-lg font-semibold mb-4">
              This account is private.
            </p>
            {!isFollowing && (
              <button
                onClick={handleFollow}
                className="bg-[#00bcd4] hover:bg-[#31a1b0] text-white font-medium px-6 py-2 rounded-md"
              >
                Follow
              </button>
            )}
          </div>
        ) : (
          <RenderPosts posts={posts} />
        )}
      </div>
    </div>
  );
}
