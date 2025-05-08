import { useState } from "react";
import Signup from "../components/login/Signup";
import Login from "../components/login/Login";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { setDoc, doc } from "firebase/firestore";
import { redirect } from "react-router-dom";

export default function Register () {
    const [typeOfRegistration, setTypeOfRegistration] = useState('signup');

    function registrationHandler () {
        setTypeOfRegistration(prevType => prevType === 'signup' ? 'login' : 'signup');
    }
    return (
        <section className="w-[100%] min-h-[90vh] bg-[#121212] flex justify-center items-center">
            {typeOfRegistration === 'signup' ? <Signup type={registrationHandler}/> : <Login type={registrationHandler}/>}
        </section>  
    )
}

export async function action ( { request } ) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username')
    const type = formData.get('typeForm');
    if(type === 'signup'){
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if(user){
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    username: username
                });
            }
            console.log('User registered successfully!!');
            return redirect('/home')
        }catch(error){
            console.log(error)
        }
    }

    if(type === 'login'){
        try{
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in successfully!');
        }catch(error){
            console.log(error.message)
        }
    }
}
