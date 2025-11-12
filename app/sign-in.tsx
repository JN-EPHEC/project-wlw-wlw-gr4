import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";

import { auth } from "../firebase";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuth = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace("/");
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || !email || password.length < 6;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "Create account" : "Sign in"}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoComplete="email"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password (min 6 characters)"
        style={styles.input}
      />
      <Button title={submitting ? "Please wait…" : isRegistering ? "Sign up" : "Sign in"} onPress={handleAuth} disabled={disabled} />
      {submitting && <ActivityIndicator />}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <View style={styles.helperRow}>
        <Text>{isRegistering ? "Already have an account?" : "Need an account?"}</Text>
        <Button title={isRegistering ? "Sign in" : "Sign up"} onPress={() => setIsRegistering((prev) => !prev)} />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center" as const,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
  },
  helperRow: {
    flexDirection: "row" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  error: {
    color: "tomato",
  },
};
