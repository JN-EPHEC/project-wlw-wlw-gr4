import { useEffect, useState, useRef, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface ClubPermissions {
  canPostInAnnouncements: boolean; // only educators + owner
  canCreateChannels: boolean; // only educators + owner
  canKickMembers: boolean; // only owner
  canManageEducators: boolean; // only owner
  canDeleteMessages: boolean; // only educators + owner + self
  canEditMessages: boolean; // only self
  isCommunityMember: boolean; // is user member of this community
}

interface UseClubPermissionsResult {
  permissions: ClubPermissions;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to check what permissions a user has in a club's community
 * @param clubId - The club ID to check permissions for
 * @param userId - The user ID to check permissions for
 * @param userRole - The user's role ('owner', 'educator', 'club', 'user')
 * @param educatorIds - Array of educator IDs in the club
 * @returns Object containing permissions and loading state
 */
export const useClubPermissions = (
  clubId: string,
  userId: string,
  userRole: 'owner' | 'educator' | 'club' | 'user',
  educatorIds: string[] = []
): UseClubPermissionsResult => {
  const [permissions, setPermissions] = useState<ClubPermissions>({
    canPostInAnnouncements: false,
    canCreateChannels: false,
    canKickMembers: false,
    canManageEducators: false,
    canDeleteMessages: false,
    canEditMessages: true, // Everyone can edit their own
    isCommunityMember: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCheckRef = useRef<string>('');

  // Stabiliser educatorIds avec useMemo
  const stableEducatorIds = useMemo(() => educatorIds, [educatorIds.join(',')]);
  
  // Créer une clé unique pour éviter les recalculs inutiles
  const checkKey = useMemo(() => `${clubId}-${userId}-${userRole}-${stableEducatorIds.join(',')}`, [clubId, userId, userRole, stableEducatorIds]);

  useEffect(() => {
    if (!clubId || !userId) {
      setLoading(false);
      return;
    }

    // Ne pas recalculer si c'est identique à la dernière vérification
    if (lastCheckRef.current === checkKey) {
      return;
    }

    const checkPermissions = async () => {
      try {
        // Get the club document to check educatorIds
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);

        if (!clubSnap.exists()) {
          console.log('❌ [useClubPermissions] Club not found for clubId:', clubId);
          setError('Club non trouvé');
          setLoading(false);
          return;
        }

        const clubData = clubSnap.data();
        const clubEducatorIds = clubData?.educatorIds || [];
        const clubOwnerId = clubData?.ownerUserId || clubData?.ownerId || clubData?.createdBy || clubData?.owner;

        // Determine if user is club owner (check multiple possible owner fields)
        const isClubOwner = userRole === 'club' || userRole === 'owner' || clubOwnerId === userId;

        // Determine if user is educator in this club
        const isEducator = userRole === 'educator' && (educatorIds.includes(userId) || clubEducatorIds.includes(userId));

        // Determine if user is community member (has made a booking = was invited)
        // For now, assume all users who access this are members
        const isMember = true;

        console.log('📊 [useClubPermissions] Detailed check:', { 
          clubId, 
          userId, 
          userRole,
          clubOwnerId,
          isClubOwner,
          isEducator,
          clubEducatorIds,
          allClubData: clubData
        });

        // Les utilisateurs avec le rôle "club" doivent avoir toutes les permissions
        // car ils sont les propriétaires du club
        const isClubAdmin = userRole === 'club' || isClubOwner;

        const newPermissions: ClubPermissions = {
          canPostInAnnouncements: isClubAdmin || isEducator,
          canCreateChannels: isClubAdmin || isEducator,
          canKickMembers: isClubAdmin,
          canManageEducators: isClubAdmin,
          canDeleteMessages: isClubAdmin || isEducator,
          canEditMessages: true, // Everyone can edit their own
          isCommunityMember: isMember,
        };

        console.log('✅ [useClubPermissions] Final permissions:', newPermissions);

        setPermissions(newPermissions);
        setError(null);
        lastCheckRef.current = checkKey;
      } catch (err) {
        console.error('❌ [useClubPermissions] Error checking permissions:', err);
        setError('Erreur lors de la vérification des permissions');
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [checkKey]);

  return { permissions, loading, error };
};
