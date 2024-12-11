
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-dQbAxv0WUQLHsKTlEIJYi_tQR2CXsF8",
  authDomain: "real-time-chat-app-cc6b6.firebaseapp.com",
  projectId: "real-time-chat-app-cc6b6",
  storageBucket: "real-time-chat-app-cc6b6.firebasestorage.app",
  messagingSenderId: "137228518232",
  appId: "1:137228518232:web:f47c68aa308a4fefc91b2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {auth};
