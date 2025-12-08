import { Stack } from 'expo-router';

export default function AuthStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup-choice" />
      <Stack.Screen name="signup-user" />
      <Stack.Screen name="signup-club" />
      <Stack.Screen name="signup-teacher" />
      <Stack.Screen name="verified" />
      <Stack.Screen name="password-reset" />
    </Stack>
  );
}
