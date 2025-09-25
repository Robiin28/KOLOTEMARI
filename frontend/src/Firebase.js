// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxTDtnEybrP9F76UVowp15xxvQsYbGaE8",
  authDomain: "kolo-temari.firebaseapp.com",
  projectId: "kolo-temari",
  storageBucket: "kolo-temari.appspot.com",
  messagingSenderId: "342845431049",
  appId: "1:342845431049:web:fa4b09e24559a551ad47d8",
  measurementId: "G-7NGJ10TXEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
export { app,storage };