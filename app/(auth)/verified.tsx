import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthHeader, PrimaryButton, authStyles, cardStyle, palette } from './AuthComponents';
import { AuthStackParamList } from '@/navigation/AuthStack';

type VerifiedRoute = RouteProp<AuthStackParamList, 'verified'>;

export default function VerifiedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<VerifiedRoute>();
  const email = route.params?.email;

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <AuthHeader title="Verification" subtitle="Validez votre email" color={palette.primary} onBack={() => navigation.navigate('login')} />
      <View style={[authStyles.content, styles.centerContent]}>
        <View style={[cardStyle, styles.card]}>
          <Ionicons name="mail-unread-outline" size={54} color={palette.primary} />
          <Text style={styles.title}>Vérifiez votre boite mail</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un lien de verification {email ? `a ${email}` : 'sur votre email'}.
            Cliquez dessus puis connectez-vous pour finaliser votre inscription.
          </Text>
          <PrimaryButton title="Retour a la connexion" onPress={() => navigation.navigate('login')} color={palette.primary} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContent: { flex: 1, justifyContent: 'center' },
  card: { alignItems: 'center', gap: 12 },
  title: { fontSize: 20, fontWeight: '800', color: palette.text, textAlign: 'center' },
  subtitle: { color: palette.gray, textAlign: 'center', lineHeight: 20 },
});
