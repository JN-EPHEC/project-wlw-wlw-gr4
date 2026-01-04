import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from '@/firebaseConfig';
import {
  acceptInviteOrRequest,
  buildInviteId,
  cancelInviteOrRequest,
  clubInviteEducator,
  educatorRequestJoinClub,
  rejectInviteOrRequest,
  type ClubEducatorInviteDoc,
} from '@/services/clubEducatorInvitations';

type InviteState = {
  invite: ClubEducatorInviteDoc | null;
  loading: boolean;
  error: string | null;
};

export function useClubEducatorInvite(
  clubId?: string | null,
  educatorId?: string | null,
): InviteState {
  const [invite, setInvite] = useState<ClubEducatorInviteDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId || !educatorId) {
      setInvite(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const inviteRef = doc(db, 'clubEducatorInvites', buildInviteId(clubId, educatorId));
    const unsubscribe = onSnapshot(
      inviteRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Omit<ClubEducatorInviteDoc, 'id'>;
          setInvite({ id: snapshot.id, ...data });
        } else {
          setInvite(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [clubId, educatorId]);

  return { invite, loading, error };
}

type PendingInvitesState = {
  invites: ClubEducatorInviteDoc[];
  loading: boolean;
  error: string | null;
};

const mapInviteDocs = (docs: QueryDocumentSnapshot<DocumentData>[]) =>
  docs.map((docSnap) => {
    const data = docSnap.data() as Omit<ClubEducatorInviteDoc, 'id'>;
    return { id: docSnap.id, ...data };
  });

export function usePendingClubEducatorInvitesForClub(
  clubId?: string | null,
): PendingInvitesState {
  const [invites, setInvites] = useState<ClubEducatorInviteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setInvites([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'clubEducatorInvites'),
      where('clubId', '==', clubId),
      where('status', '==', 'pending'),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setInvites(mapInviteDocs(snapshot.docs));
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [clubId]);

  return { invites, loading, error };
}

export function usePendingClubEducatorInvitesForEducator(
  educatorId?: string | null,
): PendingInvitesState {
  const [invites, setInvites] = useState<ClubEducatorInviteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId) {
      setInvites([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'clubEducatorInvites'),
      where('educatorId', '==', educatorId),
      where('status', '==', 'pending'),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setInvites(mapInviteDocs(snapshot.docs));
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [educatorId]);

  return { invites, loading, error };
}

type InviteActionsState = {
  loading: boolean;
  error: string | null;
  educatorRequestJoinClub: (input: { authUid: string; clubId: string; message?: string }) => Promise<string>;
  clubInviteEducator: (input: { authUid: string; educatorId: string; message?: string }) => Promise<string>;
  acceptInviteOrRequest: (input: { authUid: string; clubId: string; educatorId: string }) => Promise<string>;
  rejectInviteOrRequest: (input: { authUid: string; clubId: string; educatorId: string }) => Promise<string>;
  cancelInviteOrRequest: (input: { authUid: string; clubId: string; educatorId: string }) => Promise<string>;
};

export function useClubEducatorInviteActions(): InviteActionsState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(action: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      return await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la demande');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestJoin = useCallback(
    (input: { authUid: string; clubId: string; message?: string }) =>
      run(() => educatorRequestJoinClub(input)),
    [run],
  );

  const inviteEducator = useCallback(
    (input: { authUid: string; educatorId: string; message?: string }) =>
      run(() => clubInviteEducator(input)),
    [run],
  );

  const acceptInvite = useCallback(
    (input: { authUid: string; clubId: string; educatorId: string }) =>
      run(() => acceptInviteOrRequest(input)),
    [run],
  );

  const rejectInvite = useCallback(
    (input: { authUid: string; clubId: string; educatorId: string }) =>
      run(() => rejectInviteOrRequest(input)),
    [run],
  );

  const cancelInvite = useCallback(
    (input: { authUid: string; clubId: string; educatorId: string }) =>
      run(() => cancelInviteOrRequest(input)),
    [run],
  );

  return {
    loading,
    error,
    educatorRequestJoinClub: requestJoin,
    clubInviteEducator: inviteEducator,
    acceptInviteOrRequest: acceptInvite,
    rejectInviteOrRequest: rejectInvite,
    cancelInviteOrRequest: cancelInvite,
  };
}
