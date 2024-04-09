import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyALAEAHf_1MJJ4FmlJdKQhR0Or0iUYCSm8",
    authDomain: "christian-blog-cc053.firebaseapp.com",
    projectId: "christian-blog-cc053",
    storageBucket: "christian-blog-cc053.appspot.com",
    messagingSenderId: "470084113817",
    appId: "1:470084113817:web:8a3a5477c8d664b3c52f08",
    measurementId: "G-QZJECLS70L"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export {auth, db, storage, analytics}