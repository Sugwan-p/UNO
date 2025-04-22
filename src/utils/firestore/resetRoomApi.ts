import type { Card } from '@/types/uno';

import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { createDeck, shuffleDeck } from '@/utils/gameUtils';

export const resetRoom = async (roomId: string) => {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const players: string[] = data.players;
  const deck = shuffleDeck(createDeck());

  const hands: Record<string, Card[]> = {};

  players.forEach((id) => {
    hands[id] = deck.splice(0, 7);
  });

  const discardPile: Card[] = [deck.shift()!];

  await updateDoc(ref, {
    hands,
    deck,
    discardPile,
    turnIndex: 0,
    forcedColor: null,
  });
};
