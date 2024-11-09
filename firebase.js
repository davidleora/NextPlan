// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABa2eWQq7Bm7JkBS0EJSqEkBTbCcyFQbc",
  authDomain: "nextplan-f4340.firebaseapp.com",
  projectId: "nextplan-f4340",
  storageBucket: "nextplan-f4340.firebasestorage.app",
  messagingSenderId: "399053612794",
  appId: "1:399053612794:web:07757f86275f0c5046cb43",
  measurementId: "G-GZY2NBS1LL",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
