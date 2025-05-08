import { useState } from "react";
import Signup from "../components/login/Signup";
import Login from "../components/login/Login";

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
    // console.log(FormData)
    console.log(formData.get('email'));
    console.log('radi')
}
