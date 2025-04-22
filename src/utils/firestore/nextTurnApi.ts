import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export const nextTurn = async (roomId: string) => {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const players: string[] = data.players;
  const current = data.turnIndex ?? 0;
  const next = (current + 1) % players.length;

  await updateDoc(ref, { turnIndex: next });
};
