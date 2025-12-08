import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthHeader, InfoCard, PrimaryButton, authStyles, cardStyle, palette } from './AuthComponents';
import { AuthStackParamList } from '@/navigation/AuthStack';

type ChoiceCardProps = {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  color: string;
  actionLabel: string;
  target: keyof AuthStackParamList;
};

export default function SignupChoiceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const choices: ChoiceCardProps[] = [
    {
      title: 'Compte particulier',
      description: 'Pour les proprietaires qui reservent des seances et suivent la progression de leurs chiens.',
      bullets: [
        'Reserver des seances de dressage',
        'Gerer le profil de vos chiens',
        'Acceder aux outils communautaires',
        'Rejoindre des clubs canins',
      ],
      icon: <Ionicons name="person-circle-outline" size={34} color="#fff" />,
      color: palette.primary,
      actionLabel: 'Continuer en tant que particulier',
      target: 'signupUser',
    },
    {
      title: 'Compte educateur / independant',
      description: 'Pour les educateurs canins qui proposent des seances a titre individuel.',
      bullets: ['Proposer vos seances', 'Gerer agenda et tarifs', 'Obtenir le badge Smart Dogs', 'Visibilite renforcee'],
      icon: <Ionicons name="school-outline" size={32} color="#fff" />,
      color: palette.teacher,
      actionLabel: 'Continuer en tant qu educateur',
      target: 'signupTeacher',
    },
    {
      title: 'Compte club / structure',
      description: 'Pour les clubs canins et structures qui gerent plusieurs educateurs.',
      bullets: [
        'Creer et gerer votre club',
        'Gerer plusieurs educateurs',
        'Organiser des evenements',
        'Animer une communaute',
      ],
      icon: <Ionicons name="business-outline" size={32} color="#fff" />,
      color: palette.club,
      actionLabel: 'Continuer en tant que club',
      target: 'signupClub',
    },
  ];

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <AuthHeader title="Creer un compte" subtitle="Choisissez votre type de compte" color={palette.primary} onBack={() => navigation.navigate('login')} />
      <ScrollView contentContainerStyle={[authStyles.content, { marginTop: -16 }]}>
        {choices.map((choice) => (
          <View key={choice.title} style={[cardStyle, styles.card]}>
            <View style={[styles.iconWrapper, { backgroundColor: choice.color }]}>
              {choice.icon}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{choice.title}</Text>
              <Text style={styles.description}>{choice.description}</Text>
              {choice.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={16} color={choice.color} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
            <PrimaryButton
              title={choice.actionLabel}
              onPress={() => navigation.navigate(choice.target)}
              color={choice.color}
            />
          </View>
        ))}

        <InfoCard
          title="Besoin d aide ?"
          description="Si vous ne savez pas quel type de compte choisir, contactez-nous sur support@smartdogs.fr"
          color={palette.primary}
          icon={<Ionicons name="information-circle-outline" size={22} color={palette.primary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  iconWrapper: {
    height: 52,
    width: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '800', color: palette.text },
  description: { color: palette.gray, marginTop: 4, marginBottom: 6, lineHeight: 18 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bulletText: { color: palette.text, fontSize: 13.5 },
});
