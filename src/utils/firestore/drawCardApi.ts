import type { Card } from '@/types/uno';

import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export const drawCard = async (roomId: string, playerId: string) => {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const deck: Card[] = data.deck ?? [];
  const hands: Record<string, Card[]> = data.hands ?? {};

  if (deck.length === 0) {
    console.warn('❗ 덱이 비었습니다.');

    return;
  }

  const drawnCard = deck.shift()!;

  hands[playerId] = [...(hands[playerId] ?? []), drawnCard];

  await updateDoc(ref, {
    deck,
    hands,
  });

  console.log(`📥 ${playerId} → 카드 뽑기`, drawnCard);
};
