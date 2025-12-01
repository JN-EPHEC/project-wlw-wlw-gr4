import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import du config Firebase
import { firebaseConfig } from "./firebase_env";

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Facebook Auth Provider
export const provider = new FacebookAuthProvider();


// Export default
export default app;