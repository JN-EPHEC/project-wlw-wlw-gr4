import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
