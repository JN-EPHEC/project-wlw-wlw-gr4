import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Import du config Firebase
import { firebaseConfig } from "./firebase_env";

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
export const auth = Platform.OS === "web"
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
export const storage = getStorage(app);
export const db = getFirestore(app);

// Facebook Auth Provider
export const provider = new FacebookAuthProvider();


// Export default
export default app;
