import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { ArrowLeft, Camera, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface EditDogPageProps {
  dogId: string;
  onBack: () => void;
  onSave?: (dogData: any) => void;
}

export function EditDogPage({ dogId, onBack, onSave }: EditDogPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    height: '',
    otherInfo: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [vaccineFileName, setVaccineFileName] = useState<string>('');

  const dogBreeds = [
    'Golden Retriever',
    'Labrador',
    'Berger Allemand',
    'Bouledogue Français',
    'Chihuahua',
    'Yorkshire Terrier',
    'Beagle',
    'Caniche',
    'Boxer',
    'Husky Sibérien',
    'Border Collie',
    'Jack Russell',
    'Cocker Spaniel',
    'Berger Australien',
    'Teckel',
    'Autre'
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVaccineFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVaccineFileName(file.name);
    }
  };

  const handleAdditionalPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setAdditionalPhotos([...additionalPhotos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalPhoto = (index: number) => {
    setAdditionalPhotos(additionalPhotos.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const d = await getDoc(doc(db, 'Chien', dogId));
        if (d.exists()) {
          const data = d.data();
          setFormData({
            name: data.name || '',
            breed: data.breed || '',
            age: data.birthDate || data.age || '',
            weight: data.weight || '',
            height: data.height || '',
            otherInfo: data.otherInfo || '',
          });
          setPhotoPreview(data.photoUrl || data.image || null);
          setAdditionalPhotos(data.additionalPhotos || []);
          setVaccineFileName(data.vaccineFile || '');
        } else {
          console.error('Dog not found', dogId);
        }
      } catch (err) {
        console.error('Failed to load dog', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dogId]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.breed) {
      alert('Veuillez remplir au minimum le nom et la race de votre chien');
      return;
    }

    if (!user?.uid) {
      alert('Vous devez être connecté pour modifier ce chien');
      return;
    }

    setLoading(true);
    try {
      let photoUrl: string | undefined = undefined;
      if (photoFile) {
        const path = `dogs/${user.uid}/${Date.now()}_${photoFile.name}`;
        const imgRef = storageRef(storage, path);
        await uploadBytes(imgRef, photoFile);
        photoUrl = await getDownloadURL(imgRef);
      }

      const ref = doc(db, 'Chien', dogId);
      const payload = {
        name: formData.name,
        breed: formData.breed,
        birthDate: formData.age || '',
        weight: formData.weight || '',
        height: formData.height || '',
        otherInfo: formData.otherInfo || '',
        photoUrl: photoUrl !== undefined ? photoUrl : photoPreview || undefined,
        additionalPhotos: additionalPhotos || [],
        vaccineFile: vaccineFileName || undefined,
        updatedAt: serverTimestamp(),
      };
      const cleanedPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));
      await updateDoc(ref, cleanedPayload as any);
      onSave?.({ id: dogId, ...formData, photoUrl });
      alert('Profil mis à jour avec succès');
      onBack();
    } catch (err: any) {
      console.error('Failed to update dog', err);
      const msg = err?.message || JSON.stringify(err);
      alert('Erreur lors de la mise à jour du chien: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-white">Modifier le profil</h1>
            <p className="text-white/80 text-sm">Mettre à jour les informations de {formData.name || 'votre chien'}</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-6">
        {/* Photo Upload */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/5 to-white">
          <Label className="text-gray-800 mb-3 block">Photo de profil *</Label>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#41B6A6] bg-gray-100 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-12 w-12 text-gray-400" />
                )}
              </div>
              {photoPreview && (
                <button
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <label htmlFor="photo-upload">
              <Button
                type="button"
                variant="outline"
                className="border-[#41B6A6] text-[#41B6A6] hover:bg-[#41B6A6]/10"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {photoPreview ? 'Changer la photo' : 'Télécharger une photo'}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations générales</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">Nom du chien *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Max"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="breed" className="text-gray-700">Race *</Label>
              <Select
                value={formData.breed}
                onValueChange={(value) => setFormData({ ...formData, breed: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Sélectionnez une race" />
                </SelectTrigger>
                <SelectContent>
                  {dogBreeds.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-gray-700">Âge</Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Ex: 3 ans"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-gray-700">Poids</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="Ex: 25 kg"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="height" className="text-gray-700">Taille au garrot</Label>
              <Input
                id="height"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="Ex: 55 cm"
                className="mt-1.5"
              />
            </div>
          </div>
        </Card>

        {/* Health Documents */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Documents de santé</h3>
          <div>
            <Label htmlFor="vaccine-file" className="text-gray-700">Carnet de vaccination (PDF)</Label>
            <div className="mt-2">
              {vaccineFileName ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <span className="text-sm text-gray-700">{vaccineFileName}</span>
                  </div>
                  <button
                    onClick={() => setVaccineFileName('')}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label htmlFor="vaccine-file">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#41B6A6] hover:bg-[#41B6A6]/5 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Cliquez pour télécharger un PDF</p>
                    <p className="text-xs text-gray-400 mt-1">Format: PDF uniquement</p>
                  </div>
                  <input
                    id="vaccine-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleVaccineFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations complémentaires</h3>
          <div>
            <Label htmlFor="otherInfo" className="text-gray-700">Notes & observations</Label>
            <Textarea
              id="otherInfo"
              value={formData.otherInfo}
              onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
              placeholder="Particularités, allergies, comportement, préférences alimentaires..."
              className="mt-1.5 min-h-[120px]"
            />
          </div>
        </Card>

        {/* Additional Photos Gallery */}
        <Card className="p-6 shadow-sm border-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Photos supplémentaires</h3>
            <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
              {additionalPhotos.length} photo{additionalPhotos.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Ajoutez des photos de votre chien (jusqu'à 10 photos)
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {additionalPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeAdditionalPhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {additionalPhotos.length < 10 && (
              <label htmlFor="additional-photos" className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-[#41B6A6] cursor-pointer transition-colors">
                <Camera className="h-6 w-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500 text-center px-2">Ajouter</p>
                <input
                  id="additional-photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalPhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          {additionalPhotos.length >= 10 && (
            <p className="text-xs text-orange-600 mt-3 text-center">
              Limite de 10 photos atteinte
            </p>
          )}
        </Card>

        {/* Bottom Buttons */}
        <div className="flex gap-3 pb-24">
          <Button
            variant="outline"
            onClick={onBack}
            className={`flex-1 h-12 rounded-xl border-gray-300 bg-white ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className={`flex-1 h-12 rounded-xl bg-[#41B6A6] hover:bg-[#359889] text-white ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}