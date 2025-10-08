import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

// test index

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Bienvenue sur mon application 👋
      </ThemedText>

      <ThemedText type="default" style={styles.description}>
        Découvrez une nouvelle expérience mobile simple, fluide et moderne. 
        Ici, vous pouvez explorer toutes les fonctionnalités à venir.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // centre verticalement
    alignItems: 'center', // centre horizontalement
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});