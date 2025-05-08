// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRHx4NGHkELbi9685fxtuj8j4DVU6yQFA",
  authDomain: "vibely-2628d.firebaseapp.com",
  projectId: "vibely-2628d",
  storageBucket: "vibely-2628d.firebasestorage.app",
  messagingSenderId: "1050296505080",
  appId: "1:1050296505080:web:c438089eb8259b2bbd610d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app)
export default app;