import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import { useClubGallery, GalleryImage } from '@/hooks/useClubGallery';

type Props = NativeStackScreenProps<ClubStackParamList, 'editGallery'>;

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  green: '#16A34A',
};

const imageSize = (Dimensions.get('window').width - 48) / 3;

export default function EditGalleryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { images, addImage, deleteImage, reorderImages, canAddMorePhotos, totalPhotos } = useClubGallery(
    user?.uid || null
  );

  const [uploading, setUploading] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localImages, setLocalImages] = useState<GalleryImage[]>(images);

  const pickImage = async (useCamera: boolean = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        // Permettre multi-select
        for (const asset of result.assets) {
          if (canAddMorePhotos) {
            await uploadPhoto(asset.uri);
          } else {
            Alert.alert('Limite atteinte', `Vous avez atteint le maximum de 10 photos`);
            break;
          }
        }
      }
    } catch (err) {
      console.error('Erreur lors du pick image:', err);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission requise', 'Nous avons besoin d\'accès à la caméra');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Erreur lors du take photo:', err);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const uploadPhoto = async (uri: string) => {
    if (!canAddMorePhotos) {
      Alert.alert('Limite atteinte', `Vous avez atteint le maximum de ${10} photos`);
      return;
    }

    setUploading(true);
    try {
      await addImage(uri);
      Alert.alert('Succès', 'Photo uploadée avec succès');
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible d\'uploader la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert('Supprimer la photo', 'Êtes-vous sûr de vouloir supprimer cette photo?', [
      { text: 'Annuler', onPress: () => {} },
      {
        text: 'Supprimer',
        onPress: async () => {
          const image = images.find(img => img.id === imageId);
          if (image) {
            try {
              await deleteImage(imageId, image.url);
              Alert.alert('Succès', 'Photo supprimée');
            } catch (err) {
              Alert.alert('Erreur', 'Impossible de supprimer la photo');
            }
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAddPress = () => {
    Alert.alert('Ajouter une photo', 'Choisissez une option', [
      { text: 'Annuler', onPress: () => {} },
      {
        text: 'Bibliothèque',
        onPress: () => pickImage(),
      },
      {
        text: 'Caméra',
        onPress: () => takePhoto(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Galerie photos</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.container}>
          {/* Bouton Ajouter */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress} disabled={uploading || !canAddMorePhotos}>
            {uploading ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : (
              <>
                <Ionicons name="add" size={24} color={palette.primary} />
                <Text style={styles.addButtonText}>+ Ajouter</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info photos */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {totalPhotos}/10 photos
            </Text>
            <Text style={styles.infoSubtext}>Les photos de qualité augmentent vos réservations de 40%</Text>
          </View>

          {/* Galerie */}
          {images.length > 0 ? (
            <View style={styles.gallery}>
              {images.map((image) => (
                <View key={image.id} style={styles.photoContainer}>
                  <Image source={{ uri: image.url }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(image.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={palette.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="image-outline" size={48} color={palette.gray} />
              <Text style={styles.emptyText}>Aucune photo pour le moment</Text>
              <Text style={styles.emptySubtext}>Cliquez sur "+ Ajouter" pour commencer</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.lightGray,
  },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  container: {
    padding: 16,
    gap: 16,
  },
  addButton: {
    borderWidth: 2,
    borderColor: palette.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.primary,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  infoSubtext: {
    fontSize: 12,
    color: palette.gray,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: imageSize,
    height: imageSize,
    borderRadius: 12,
    backgroundColor: palette.lightGray,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: palette.gray,
  },
});
