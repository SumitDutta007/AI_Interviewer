import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-interviewer-1de7d.firebaseapp.com",
  projectId: "ai-interviewer-1de7d",
  storageBucket: "ai-interviewer-1de7d.firebasestorage.app",
  messagingSenderId: "175367732033",
  appId: "1:175367732033:web:4a9a7c9f1f2c31bce5ffc0",
  measurementId: "G-7R3RRMDM6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const authPersistence = setPersistence(auth, browserLocalPersistence)

export { auth, authPersistence, provider }