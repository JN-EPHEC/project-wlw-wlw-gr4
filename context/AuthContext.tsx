import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { auth, db, storage } from '@/firebase';
import { resetToHome } from '@/navigation/navigationRef';
import { UploadableFile } from '@/types/uploads';

type OwnerSignupData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  password: string;
   profilePhoto?: UploadableFile;
   newsletterOptIn?: boolean;
   acceptTerms: boolean;
};

type TeacherSignupData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  password: string;
  specialties: string[];
  experience?: string;
  certifications?: string;
  bio?: string;
  website?: string;
  profilePhoto?: UploadableFile;
  documents?: UploadableFile[];
  newsletterOptIn?: boolean;
  acceptTerms: boolean;
};

type ClubSignupData = {
  clubName: string;
  legalName?: string;
  siret: string;
  website?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  services: string[];
  description?: string;
  password: string;
  logo?: UploadableFile;
  documents?: UploadableFile[];
  newsletterOptIn?: boolean;
  acceptTerms: boolean;
};

type AuthContextValue = {
  user: User | null;
  profile: Record<string, unknown> | null;
  initializing: boolean;
  actionLoading: boolean;
  login(email: string, password: string): Promise<void>;
  registerOwner(data: OwnerSignupData): Promise<void>;
  registerTeacher(data: TeacherSignupData): Promise<void>;
  registerClub(data: ClubSignupData): Promise<void>;
  resetPassword(email: string): Promise<void>;
  logout(): Promise<void>;
  deleteAccount(): Promise<void>;
  refreshProfile(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProfile = async (uid: string) => {
    const snap = await getDoc(doc(db, 'users', uid));
    setProfile(snap.exists() ? snap.data() : null);
  };

  const uploadFileToStorage = async (file: UploadableFile, folder: string) => {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const extension =
      (file.name && file.name.split('.').pop()) ||
      (file.mimeType && file.mimeType.split('/').pop()) ||
      'dat';
    const storagePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${extension}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  const uploadMany = async (files: UploadableFile[] | undefined, folder: string) => {
    if (!files?.length) return [];
    return Promise.all(files.map((file) => uploadFileToStorage(file, folder)));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          await loadProfile(nextUser.uid);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setActionLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } finally {
      setActionLoading(false);
    }
  };

  const registerOwner = async (data: OwnerSignupData) => {
    setActionLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const credential = await createUserWithEmailAndPassword(auth, email, data.password);
      const displayName = `${data.firstName} ${data.lastName}`.trim();
      if (displayName) {
        await updateProfile(credential.user, {
          displayName,
        });
      }
      const photoUrl = data.profilePhoto
        ? await uploadFileToStorage(data.profilePhoto, `users/${credential.user.uid}/profile`)
        : undefined;
      await setDoc(doc(db, 'users', credential.user.uid), {
        role: 'owner',
        email,
        displayName,
        profile: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phone: data.phone?.trim() ?? '',
          city: data.city?.trim() ?? '',
          photoUrl: photoUrl ?? null,
          newsletterOptIn: !!data.newsletterOptIn,
          acceptTerms: !!data.acceptTerms,
          roleLabel: 'owner',
        },
      });
      await loadProfile(credential.user.uid);
    } finally {
      setActionLoading(false);
    }
  };

  const registerTeacher = async (data: TeacherSignupData) => {
    setActionLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const credential = await createUserWithEmailAndPassword(auth, email, data.password);
      const displayName = `${data.firstName} ${data.lastName}`.trim();
      if (displayName) {
        await updateProfile(credential.user, {
          displayName,
        });
      }
      const photoUrl = data.profilePhoto
        ? await uploadFileToStorage(data.profilePhoto, `users/${credential.user.uid}/profile`)
        : undefined;
      const documentUrls = await uploadMany(data.documents, `users/${credential.user.uid}/documents`);
      const educatorId = credential.user.uid;
      await setDoc(doc(db, 'users', credential.user.uid), {
        role: 'educator',
        educatorId,
        email,
        displayName,
        profile: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phone: data.phone?.trim() ?? '',
          city: data.city?.trim() ?? '',
          postalCode: data.postalCode?.trim() ?? '',
          specialties: data.specialties,
          experience: data.experience?.trim() ?? '',
          certifications: data.certifications?.trim() ?? '',
          bio: data.bio?.trim() ?? '',
          website: data.website?.trim() ?? '',
          documents: documentUrls,
          photoUrl: photoUrl ?? null,
          newsletterOptIn: !!data.newsletterOptIn,
          acceptTerms: !!data.acceptTerms,
          roleLabel: 'educator',
          educatorId,
        },
      });
      await setDoc(doc(db, 'educators', educatorId), {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        phone: data.phone?.trim() ?? '',
        city: data.city?.trim() ?? '',
        postalCode: data.postalCode?.trim() ?? '',
        specialties: data.specialties,
        experience: data.experience?.trim() ?? '',
        certifications: data.certifications?.trim() ?? '',
        presentation: data.bio?.trim() ?? '',
        website: data.website?.trim() ?? '',
        documents: documentUrls,
        photoUrl: photoUrl ?? null,
        hourlyRate: 0,
        experienceYears: 0,
        availabilityKm: 5,
        averageRating: 0,
        reviewsCount: 0,
        isActive: true,
        createdAt: new Date(),
      });
      await loadProfile(credential.user.uid);
    } finally {
      setActionLoading(false);
    }
  };

  const registerClub = async (data: ClubSignupData) => {
    setActionLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const credential = await createUserWithEmailAndPassword(auth, email, data.password);
      const displayName = data.clubName.trim();
      if (displayName) {
        await updateProfile(credential.user, {
          displayName,
        });
      }
      const logoUrl = data.logo
        ? await uploadFileToStorage(data.logo, `users/${credential.user.uid}/logo`)
        : undefined;
      const documentUrls = await uploadMany(data.documents, `users/${credential.user.uid}/documents`);
      const clubId = credential.user.uid;
      await setDoc(doc(db, 'users', credential.user.uid), {
        role: 'club',
        email,
        displayName,
        clubId,
        profile: {
          clubName: data.clubName.trim(),
          legalName: data.legalName?.trim() ?? '',
          siret: data.siret.trim(),
          website: data.website?.trim() ?? '',
          description: data.description?.trim() ?? '',
          services: data.services,
          phone: data.phone.trim(),
          address: data.address?.trim() ?? '',
          city: data.city?.trim() ?? '',
          postalCode: data.postalCode?.trim() ?? '',
          documents: documentUrls,
          logoUrl: logoUrl ?? null,
          newsletterOptIn: !!data.newsletterOptIn,
          acceptTerms: !!data.acceptTerms,
          roleLabel: 'club',
        },
      });
      await setDoc(doc(db, 'club', clubId), {
        ownerUserId: clubId,
        name: data.clubName.trim(),
        legalName: data.legalName?.trim() ?? '',
        siret: data.siret.trim(),
        description: data.description?.trim() ?? '',
        services: data.services.join(', '),
        servicesList: data.services,
        phone: data.phone.trim(),
        email,
        address: data.address?.trim() ?? '',
        city: data.city?.trim() ?? '',
        postalCode: data.postalCode?.trim() ?? '',
        website: data.website?.trim() ?? '',
        logoUrl: logoUrl ?? null,
        documents: documentUrls,
        clubType: 'public',
        maxGroupSize: 10,
        averageRating: 0,
        reviewsCount: 0,
        isVerified: false,
        priceLevel: 2,
        distanceKm: 0,
        createdAt: new Date(),
      });
      await loadProfile(credential.user.uid);
    } finally {
      setActionLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setActionLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    setActionLoading(true);
    try {
      await signOut(auth);
      resetToHome();
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) return;
    setActionLoading(true);
    try {
      const uid = auth.currentUser.uid;

      // Nettoyage basique : doc utilisateur + quelques sous-collections frequentes
      try {
        const subCollections = ['dogs', 'bookings', 'notifications'];
        await Promise.all(
          subCollections.map(async (sub) => {
            const q = query(collection(db, 'users', uid, sub));
            const snap = await getDocs(q);
            await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
          }),
        );
      } catch {
        // ignorer si absent
      }

      await deleteDoc(doc(db, 'users', uid));
      await deleteUser(auth.currentUser);
    } finally {
      setActionLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      initializing,
      actionLoading,
      login,
      registerOwner,
      registerTeacher,
      registerClub,
      resetPassword,
      logout,
      deleteAccount,
      refreshProfile: () => (user ? loadProfile(user.uid) : Promise.resolve()),
    }),
    [user, profile, initializing, actionLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export function formatFirebaseAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Identifiants incorrects. Verifiez votre email et votre mot de passe.';
      case 'auth/user-not-found':
        return 'Aucun compte trouve avec cet email.';
      case 'auth/email-already-in-use':
        return 'Un compte existe deja avec cet email.';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caracteres.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Reessayez dans quelques instants.';
      case 'auth/requires-recent-login':
        return 'Reconnectez-vous puis reessayez.';
      default:
        return 'Une erreur est survenue. Merci de reessayer.';
    }
  }
  return 'Une erreur est survenue. Merci de reessayer.';
}
