import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ ICI : import NOMMÉ (avec accolades)
import { firebaseConfig } from "./firebase_env";

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les instances des services pour les utiliser ailleurs dans l'app
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Optionnel mais pratique si tu veux importer l'app ailleurs n
export default app;
