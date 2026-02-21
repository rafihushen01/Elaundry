// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import{getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "e-loundrey.firebaseapp.com",
  projectId: "e-loundrey",
  storageBucket: "e-loundrey.firebasestorage.app",
  messagingSenderId: "1050414310718",
  appId: "1:1050414310718:web:bca5a0403562119be7786f",
  measurementId: "G-90J3NZTPKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Auth=getAuth(app)

export {app,Auth}

