import { StyleSheet, Text, View } from "react-native";

export default function HelloWorld() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 salut les brothers !</Text>
      <Text style={styles.subtitle}>I’m ready to build cool mobile apps 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});