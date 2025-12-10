import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function TestDetailScreen() {
  const route = useRoute();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('🔍 Test: Tentative de récupération depuis Firebase...');
        
        // Test avec les IDs trouvés
        const testIds = [
          { collection: 'club', id: '12IUbeQluFP9tiQDxJo0' },
          { collection: 'educators', id: 'y91mC9GIDE8jbmeTU7lb' },
          { collection: 'events', id: 'II73f3irfNuPAXRvczBw' },
        ];

        for (const test of testIds) {
          try {
            const docRef = doc(db, test.collection, test.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              console.log(`✅ ${test.collection}: Document trouvé!`, docSnap.data());
            } else {
              console.log(`❌ ${test.collection}: Document non trouvé`);
            }
          } catch (err) {
            console.log(`❌ ${test.collection}: Erreur -`, err.message);
          }
        }

        setData('Test completed - check logs');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testFetch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={{ color: 'red' }}>Erreur: {error}</Text>
        ) : (
          <Text style={{ color: 'green' }}>{data}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
