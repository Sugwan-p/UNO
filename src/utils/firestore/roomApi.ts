import type { Card } from '@/types/uno';

import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';
import { createDeck, shuffleDeck } from '@/utils/unoLogic';

export const createRoom = async (roomId: string, playerIds: string[]) => {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);

  // ❗ 이미 존재하는 방이면 초기화하지 않음
  if (snap.exists()) {
    return;
  }

  const deck = shuffleDeck(createDeck());

  const hands: Record<string, Card[]> = {};

  playerIds.forEach((id) => {
    hands[id] = deck.splice(0, 7);
  });

  const discardPile = [deck.shift()!];

  await setDoc(ref, {
    players: playerIds,
    joined: [playerIds[0]], // ✅ player1 자동 등록
    hands,
    deck,
    discardPile,
    turnIndex: 0,
    forcedColor: null,
    winner: null,
    createdAt: Date.now(),
  });
};
