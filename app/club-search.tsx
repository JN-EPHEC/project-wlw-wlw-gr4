import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
};

interface Club {
    id: string;
    name: string;
    distance: number;
}

const ClubSearch: React.FC<{navigation: any}> = ({ navigation }) => {
    const [city, setCity] = useState('');
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const functions = getFunctions(app);
    const findNearbyClubs = httpsCallable(functions, 'findNearbyClubs');

    const handleSearch = async () => {
        if (!city.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer un nom de ville.');
            return;
        }

        setLoading(true);
        setError(null);
        setClubs([]);

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') throw new Error('Permission de localisation refusée');
            
            const locations = await Location.geocodeAsync(city);
            if (locations.length === 0) throw new Error('Ville non trouvée.');

            const { latitude, longitude } = locations[0];
            const result = await findNearbyClubs({ latitude, longitude, radius: 50 });
            setClubs(result.data as Club[]);

        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Rechercher un club</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez une ville..."
                    value={city}
                    onChangeText={setCity}
                    placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
                    <Text style={styles.buttonText}>Rechercher</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 20}} />}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={clubs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.clubName}>{item.name}</Text>
                        <Text style={styles.distance}>{`${item.distance.toFixed(2)} km`}</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    !loading && city && <Text style={styles.emptyText}>Aucun club trouvé pour cette ville.</Text>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
    backBtn: { padding: 8 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', padding: 16, gap: 10 },
    input: { flex: 1, height: 50, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, backgroundColor: colors.surface, fontSize: 16 },
    button: { height: 50, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    errorText: { color: colors.error, textAlign: 'center', margin: 16 },
    list: { paddingHorizontal: 16, paddingTop: 8 },
    card: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
    clubName: { fontSize: 16, fontWeight: '600', color: colors.text },
    distance: { fontSize: 14, color: colors.primary, fontWeight: '500' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: colors.textMuted }
});

export default ClubSearch;