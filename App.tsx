import 'react-native-gesture-handler';
import React from 'react';

import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { DjanaiProvider } from './context/DjanaiContext';

export default function App() {
  return (
    <AuthProvider>
      <DjanaiProvider>
        <AppNavigator />
      </DjanaiProvider>
    </AuthProvider>
  );
}
