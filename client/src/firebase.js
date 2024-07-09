// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-c6c04.firebaseapp.com",
  projectId: "mern-blog-c6c04",
  storageBucket: "mern-blog-c6c04.appspot.com",
  messagingSenderId: "375377577079",
  appId: "1:375377577079:web:81dabf92f6f5df3bbd3272",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
