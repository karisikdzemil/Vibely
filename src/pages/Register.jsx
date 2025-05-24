import { useState } from "react";
import Signup from "../components/login/Signup";
import Login from "../components/login/Login";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function Register () {
    const [typeOfRegistration, setTypeOfRegistration] = useState('signup');

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        return <Navigate to="/home" replace />;
    }

    function registrationHandler () {
        setTypeOfRegistration(prevType => prevType === 'signup' ? 'login' : 'signup');
    }
    return (
        <section className="w-[100%] min-h-[100vh] dark:bg-gray-900 bg-gray-100 flex justify-center items-center flex-col">
            {typeOfRegistration === 'signup' ? <Signup type={registrationHandler}/> : <Login type={registrationHandler}/>}
        </section>  
    )
}

export async function action ( { request } ) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');
    const type = formData.get('typeForm');
    if(type === 'signup'){
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if(user){
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    username: username,
                    about: '',
                    profilePicture: '',
                    savedPosts: [],
                    followers: [],
                    following: [],
                    profileVisibility: false,
                });
            }

            const userData = {
                uid: user.uid,
                email: user.email,
                username: username,
                about: '',
                profilePicture: ''
            };
            localStorage.setItem("user", JSON.stringify(userData));

            return redirect('/home')
        }catch(error){
            console.log(error)
        }
    }

    if(type === 'login'){
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            const docSnap = await getDoc(doc(db, "Users", user.uid));
            const data = docSnap.data();
            const userData = {
                uid: user.uid,
                email: user.email,
                username: data.username,
                about: data.about,
                profilePicture: data.profilePicture
            };
            localStorage.setItem("user", JSON.stringify(userData));
            return redirect('/home');

        }catch(error){
            console.log(error.message)
        }
    }
}
