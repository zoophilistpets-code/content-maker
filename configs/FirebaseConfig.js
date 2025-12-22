// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
	authDomain: "coloration-5459d.firebaseapp.com",
	projectId: "coloration-5459d",
	storageBucket: "coloration-5459d.appspot.com",
	messagingSenderId: "855954393160",
	appId: "1:855954393160:web:a19f2ed6595d75df11b07d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);