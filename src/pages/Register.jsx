import { useState, useEffect} from "react";
import Signup from "../components/login/Signup";
import Login from "../components/login/Login";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTheme } from "../store/theme-slice";

export default function Register () {
    const dispatch = useDispatch();
    const [typeOfRegistration, setTypeOfRegistration] = useState('signup');

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        return <Navigate to="/home" replace />;
    }

  useEffect(() => {
      dispatch(setTheme(localStorage.getItem("theme") || "dark"));
  }, [dispatch]);

    function registrationHandler () {
        setTypeOfRegistration(prevType => prevType === 'signup' ? 'login' : 'signup');
    }
    return (
        <section className="w-[100%] md:min-h-[100vh] min-h-[110vh] dark:bg-gray-900 bg-gray-100 flex justify-center items-center flex-col">
            {typeOfRegistration === 'signup' ? <Signup type={registrationHandler}/> : <Login type={registrationHandler}/>}
        </section>  
    )
}

export async function action({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
    const type = formData.get("typeForm");
  
    if (type === "signup") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
  
        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            username: username,
            about: "",
            profilePicture: "",
            savedPosts: [],
            followers: [],
            following: [],
            profileVisibility: false,
          });
  
          const userData = {
            uid: user.uid,
            email: user.email,
            username: username,
            about: "",
            profilePicture: "",
          };
          localStorage.setItem("user", JSON.stringify(userData));
          return redirect("/home");
        }
      } catch (error) {
        let message = "Registration failed.";
        if (error.code === "auth/email-already-in-use") {
          message = "Email is already in use.";
        } else if (error.code === "auth/weak-password") {
          message = "Password should be at least 6 characters.";
        } else if (error.code === "auth/invalid-email") {
          message = "Invalid email address.";
        }
        return { error: message };
      }
    }
  
    if (type === "login") {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
  
        const docSnap = await getDoc(doc(db, "Users", user.uid));
        const data = docSnap.data();
        const userData = {
          uid: user.uid,
          email: user.email,
          username: data.username,
          about: data.about,
          profilePicture: data.profilePicture,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return redirect("/home");
      } catch (error) {
        let message = "Login failed.";
        if (error.code === "auth/user-not-found") {
          message = "User does not exist.";
        } else if (error.code === "auth/wrong-password") {
          message = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          message = "Invalid email.";
        } else if (error.code === "auth/too-many-requests") {
          message = "Too many attempts. Please try again later.";
        }
        return { error: message };
      }
    }
  }