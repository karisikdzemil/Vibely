// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { userActions } from "../../store/user-slice";
// import ProfileActionInfo from './ProfileActionInfo'
// import { storage } from "../firebase";
// import { updateDoc } from "firebase/firestore";
// import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { collection, where, query, getDocs } from "firebase/firestore";
// import { doc } from "firebase/firestore";
// import { db } from "../firebase";


// export default function ProfileImg () {

//     const [selectedImage, setSelectedImage] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [usernameError, setUsernameError] = useState("");
//     const [aboutError, setAboutError] = useState("");
//     // const [privateProfile, setPrivateProfile] = useState(false); 
//     const inputImageRef = useRef();
//     const userRef = useRef();
//     const aboutRef = useRef();
//     const [isEditing, setIsEditing] = useState(false);
//     const { userId } = useParams();
//     const dispatch = useDispatch();
//     const [userData, setUserData] = useState(null);
//     const [posts, setPosts] = useState();
  
//     let currentUser = JSON.parse(localStorage.getItem("user"));

//     const isCurrentUser = userId.replace(/^:/, "") === currentUser.uid;

//     useEffect(() => {
//         async function getUser() {
//           if (!userId) return;
//           const userRef = doc(db, "Users", userId.replace(":", ""));
//           const userSnap = await getDoc(userRef);
//           if (userSnap.exists()) {
//             setUserData(userSnap.data());
//           }
    
//           const cleanedUserId = userId.replace(/^:/, "");
//           const postsRef = collection(db, "PostsMeta");
//           const q = query(postsRef, where("userId", "==", cleanedUserId));
//           const snapshot = await getDocs(q);
    
//           const postsData = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setPosts(postsData);
//         }
//         getUser();
//       }, [userId]);
    
//       if (!userData) {
//         return (
//           <div className="w-[60%] min-h-screen flex justify-center items-center text-white">
//             <p>Loading profile...</p>
//           </div>
//         );
//       }

//      const profilePicture = !isEditing ? (
//         userData.profilePicture === "" ? (
//           <FontAwesomeIcon icon={faCircleUser} className="text-8xl text-cyan-400" />
//         ) : (
//           <img
//             src={userData.profilePicture}
//             alt="Profile"
//             className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
//           />
//         )
//       ) : previewUrl ? (
//         <img
//           src={previewUrl}
//           alt="Preview"
//           className="w-32 h-32 rounded-full object-cover border-4 border-[#00bcd4] shadow-md"
//         />
//       ) : (
//         <div
//           onClick={chooseImageHandler}
//           className="cursor-pointer w-32 h-32 bg-gray-600 flex flex-col items-center justify-center gap-3 rounded-full"
//         >
//           <h1 className="text-4xl text-white">+</h1>
//           <p className="text-sm">Add Image</p>
//         </div>
//       );
    
//       function chooseImageHandler() {
//         inputImageRef.current.click();
//       }
    
//       function imageInputHandler(event) {
//         const file = event.target.files[0];
//         if (file) {
//           setSelectedImage(file);
//           const reader = new FileReader();
//           reader.onloadend = () => setPreviewUrl(reader.result);
//           reader.readAsDataURL(file);
//         }
//       }
    
//       async function editUserHandler() {
//         if (!isEditing) {
//           setIsEditing(true);
//           return;
//         }
    
//         const enteredUsername = userRef.current?.value.trim();
//         const enteredAbout = aboutRef.current?.value.trim();
    
//         let isValid = true;
    
//         if (enteredUsername && enteredUsername.length < 3) {
//           setUsernameError("Username must be at least 3 characters.");
//           isValid = false;
//         } else {
//           setUsernameError("");
//         }
    
//         if (enteredAbout && enteredAbout.length < 3) {
//           setAboutError("About must be at least 3 characters.");
//           isValid = false;
//         } else {
//           setAboutError("");
//         }
    
//         if (!isValid) return;
    
//         try {
//           let imageUrl = userData.profilePicture;
    
//           if (selectedImage && selectedImage instanceof File) {
//             const imageRef = ref(storage, `userImages/${currentUser.uid}_${Date.now()}`);
//             await uploadBytes(imageRef, selectedImage);
//             imageUrl = await getDownloadURL(imageRef);
//           }
    
//           const changedUser = {
//             username: enteredUsername || userData.username,
//             about: enteredAbout || userData.about,
//             email: currentUser.email,
//             profilePicture: imageUrl,
//           };
    
//           const userDocRef = doc(db, "Users", currentUser.uid);
//           await updateDoc(userDocRef, changedUser);
    
//           const postsQuery = query(
//             collection(db, "PostsMeta"),
//             where("userId", "==", currentUser.uid)
//           );
//           const snapshot = await getDocs(postsQuery);
    
//           const updatePostPromises = snapshot.docs.map((docSnap) => {
//             const postRef = doc(db, "PostsMeta", docSnap.id);
//             return updateDoc(postRef, {
//               username: changedUser.username,
//               profilePicture: changedUser.profilePicture,
//             });
//           });
    
//           await Promise.all(updatePostPromises);
    
//           const updatedUser = { ...currentUser, ...changedUser };
//           localStorage.setItem("user", JSON.stringify(updatedUser));
//           dispatch(userActions.setUser(updatedUser));
//         //   setUserData(updatedUser);
//           setIsEditing(false);
//           setSelectedImage(null);
//           setPreviewUrl(null);
//         } catch (error) {
//           console.error("Error updating profile:", error);
//         }
//       }
    
//       if (userData.profileVisibility && userData.username !== currentUser.username && !userData.followers.includes(currentUser.uid)) {
//         setPrivateProfile(true);
//         <p>Proba</p>
//       }
//     return (
//         <div className="w-4/5 min-h-80 m-auto dark:bg-gray-800 bg-white rounded-2xl p-6 flex flex-col items-center relative shadow-lg">
//         {isCurrentUser && (
//           <button
//             onClick={editUserHandler}
//             className="w-25 h-10 rounded-md hover:bg-[#31a1b0] cursor-pointer absolute right-10 top-10 bg-[#00bcd4]"
//           >
//             {isEditing ? "Save" : "Edit"}
//           </button>
//         )}

//         {profilePicture}

//         {!isEditing ? (
//           <h2 className="text-2xl font-semibold mt-4">{userData.username}</h2>
//         ) : (
//           <div className="w-3/5 flex flex-col my-4">
//             <input
//               ref={userRef}
//               className="h-7 dark:bg-gray-600 bg-gray-300 pl-5 rounded"
//               placeholder={userData.username}
//             />
//             {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
//           </div>
//         )}

//         {!isEditing ? <p className="dark:text-gray-400 text-gray-700">{userData.email}</p> : ""}
//         <ProfileActionInfo />

//         <div className="mt-6 text-center w-full">
//           <h3 className="text-xl font-medium text-[#00bcd4] mb-2">About</h3>
//           {!isEditing ? (
//             <p className="dark:text-gray-300 text-gray-700">{userData.about}</p>
//           ) : (
//             <div className="w-3/5 flex flex-col m-auto">
//               <textarea
//                 ref={aboutRef}
//                 className="h-20 dark:bg-gray-600 bg-gray-300 p-2 rounded"
//                 placeholder={userData.about}
//               />
//               {aboutError && <p className="text-red-400 text-sm mt-1">{aboutError}</p>}
//             </div>
//           )}
//         </div>

//         <input
//           onChange={imageInputHandler}
//           ref={inputImageRef}
//           type="file"
//           className="hidden"
//         />
//       </div>
//     )
// }