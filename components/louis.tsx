import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Coucou: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coucou</Text>
    </View>
  );
};

export default Coucou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});