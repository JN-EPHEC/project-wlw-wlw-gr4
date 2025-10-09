import { StyleSheet } from 'react-native';

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
 return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez la race de votre chien 🐶 :</Text>

      <TouchableOpacity style={[styles.button, styles.lightBrown]}>
        <Text style={styles.buttonText}>Labrador</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.mediumBrown]}>
        <Text style={styles.buttonText}>Husky</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.coffeeBrown]}>
        <Text style={styles.buttonText}>Berger Allemand</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.darkBrown]}>
        <Text style={styles.buttonText}>Chihuahua</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E8C7', // beige clair
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5C4033', // marron foncé
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  lightBrown: {
    backgroundColor: '#C4A484', // beige marron clair
  },
  mediumBrown: {
    backgroundColor: '#A47148', // marron moyen
  },
  darkBrown: {
    backgroundColor: '#5C4033', // marron foncé
  },
  coffeeBrown: {
    backgroundColor: '#7B3F00', // brun café
  },
});