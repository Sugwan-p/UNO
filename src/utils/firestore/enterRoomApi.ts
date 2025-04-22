import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export const enterRoom = async (roomId: string): Promise<string | null> => {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();
  const players: string[] = data.players;
  const joined: string[] = data.joined ?? [];

  const nextPlayer = players.find((p) => !joined.includes(p));

  if (!nextPlayer) return null;

  await updateDoc(ref, {
    joined: [...joined, nextPlayer],
  });

  return nextPlayer;
};
