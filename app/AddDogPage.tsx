import { ArrowLeft, Camera, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface AddDogPageProps {
  onBack: () => void;
  onSave: (dogData: any) => void;
}

export function AddDogPage({ onBack, onSave }: AddDogPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    height: '',
    otherInfo: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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

  const handleSubmit = () => {
    if (!formData.name || !formData.breed) {
      alert('Veuillez remplir au minimum le nom et la race de votre chien');
      return;
    }

    const dogData = {
      ...formData,
      photo: photoPreview,
      vaccineFile: vaccineFileName,
    };

    onSave(dogData);
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
            <h1 className="text-white">Ajouter un chien</h1>
            <p className="text-white/80 text-sm">Complétez le profil de votre compagnon</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
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
                onValueChange={(value: string) => setFormData({ ...formData, breed: value })}
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
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 border-gray-300"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[#41B6A6] hover:bg-[#359889]"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}
