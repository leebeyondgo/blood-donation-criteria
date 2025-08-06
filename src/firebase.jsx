// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrEnCiWOP88XOvrMMbtUEW9ATgITVFpoA",
  authDomain: "blood-donation-criteria.firebaseapp.com",
  projectId: "blood-donation-criteria",
  storageBucket: "blood-donation-criteria.firebasestorage.app",
  messagingSenderId: "309006109383",
  appId: "1:309006109383:web:4e46773e174ddcf6914ce2",
  measurementId: "G-11H29Y2Q64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);