import { Redirect } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { user, loading, error } = useAuth();
  const [signOutLoading, setSignOutLoading] = useState(false);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Checking session…</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Auth error: {error.message}</Text>
      </View>
    );
  }

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await signOut(auth);
    } finally {
      setSignOutLoading(false);
    }
  };

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Welcome, {user.email ?? user.uid}</Text>
      <Text>You are authenticated and ready to access the app.</Text>
      <Button title={signOutLoading ? "Signing out…" : "Sign out"} onPress={handleSignOut} disabled={signOutLoading} />
    </View>
  );
}

const styles = {
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
};
