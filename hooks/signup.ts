import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase";

export type SignupRole = "user" | "teacher" | "club";

interface RegisterAccountOptions {
  email: string;
  password: string;
  displayName?: string;
  role: SignupRole;
  profile: Record<string, unknown>;
}

export async function registerAccount({
  email,
  password,
  displayName,
  role,
  profile,
}: RegisterAccountOptions) {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  await setDoc(doc(db, "users", credential.user.uid), {
    role,
    email: credential.user.email,
    displayName: credential.user.displayName,
    profile,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export function formatFirebaseAuthError(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Cette adresse email est déjà utilisée.";
      case "auth/invalid-email":
        return "L'adresse email est invalide.";
      case "auth/weak-password":
        return "Le mot de passe doit contenir au moins 6 caractères.";
      default:
        return "Impossible de créer le compte pour le moment. Réessayez ultérieurement.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}
