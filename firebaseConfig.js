import { initializeApp } from "firebase/app";
// Importez les services dont vous avez besoin
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebase_env";

// Initialiser Firebase test
const app = initializeApp(firebaseConfig);

// Exporter les instances des services pour les utiliser ailleurs dans l'app
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);