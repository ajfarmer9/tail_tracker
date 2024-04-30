import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMQH-no39S838NNHB0uEh9mRJbUXFVx2I",
  authDomain: "ace-tracker-bc078.firebaseapp.com",
  projectId: "ace-tracker-bc078",
  storageBucket: "ace-tracker-bc078.appspot.com",
  messagingSenderId: "641331768824",
  appId: "1:641331768824:web:22cee5c8067b9d5b42fa0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };