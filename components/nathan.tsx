import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CoucouComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coucou</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // centre verticalement
    alignItems: 'center', // centre horizontalement
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});