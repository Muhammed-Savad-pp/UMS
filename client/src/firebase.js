// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ums-react-redux.firebaseapp.com",
  projectId: "ums-react-redux",
  storageBucket: "ums-react-redux.appspot.com",
  messagingSenderId: "731063051395",
  appId: "1:731063051395:web:bb62ad4c9d493faaa0e7b6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);