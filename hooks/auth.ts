import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import type { SignupRole } from "./signup";

export interface SignedInAccount {
  uid: string;
  role: SignupRole;
  email: string;
  displayName?: string | null;
  profile: Record<string, unknown>;
}

export async function signInWithRole(email: string, password: string): Promise<SignedInAccount> {
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);

  const profileRef = doc(db, "users", credential.user.uid);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    return {
      uid: credential.user.uid,
      role: "user",
      email: credential.user.email ?? normalizedEmail,
      displayName: credential.user.displayName ?? null,
      profile: {},
    };
  }

  const data = snapshot.data() ?? {};
  const role = (data.role as SignupRole | undefined) ?? "user";
  const profile = (data.profile as Record<string, unknown> | undefined) ?? {};
  const displayName =
    credential.user.displayName ??
    (typeof data.displayName === "string" ? (data.displayName as string) : null);
  const emailFromData =
    (typeof data.email === "string" && data.email) ? (data.email as string) : credential.user.email ?? normalizedEmail;

  return {
    uid: credential.user.uid,
    role,
    email: emailFromData,
    displayName,
    profile,
  };
}
