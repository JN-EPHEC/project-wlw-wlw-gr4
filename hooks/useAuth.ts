import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "../firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setState({ user, loading: false, error: null }),
      (error) => setState({ user: null, loading: false, error: error as Error }),
    );

    return unsubscribe;
  }, []);

  return state;
}
