// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWYE96JfhfsOIIBC8AMfuw2liWLJpXJs0",
  authDomain: "blood-danation-criteria.firebaseapp.com",
  projectId: "blood-danation-criteria",
  storageBucket: "blood-danation-criteria.firebasestorage.app",
  messagingSenderId: "429783794484",
  appId: "1:429783794484:web:73153a87c6eb74a2255b61",
  measurementId: "G-DZXGZMY9CV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);