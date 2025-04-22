import type { Card } from '@/types/uno';

import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export const playCard = async (
  roomId: string,
  playerId: string,
  cardIndex: number,
) => {
  const roomRef = doc(db, 'rooms', roomId);
  const snap = await getDoc(roomRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const hands: Record<string, Card[]> = data.hands;
  const discardPile: Card[] = data.discardPile ?? [];
  const deck: Card[] = data.deck ?? [];
  const turnIndex: number = data.turnIndex;
  const players: string[] = data.players;
  const forcedColor: string | null = data.forcedColor ?? null;

  const card = hands[playerId][cardIndex];

  if (!card) return;

  // 카드 제거 + 버린 카드에 추가
  hands[playerId].splice(cardIndex, 1);
  discardPile.unshift(card);

  let additionalDraw = 0;
  let skipNext = false;

  if (card.value === 'drawTwo') {
    additionalDraw = 2;
    skipNext = true;
  } else if (card.value === 'wildDrawFour') {
    additionalDraw = 4;
    skipNext = true;
  } else if (
    card.value === 'skip' ||
    (card.value === 'reverse' && players.length === 2)
  ) {
    skipNext = true;
  }

  const nextTurnIndex = skipNext
    ? (turnIndex + 2) % players.length
    : (turnIndex + 1) % players.length;

  // 다음 플레이어에게 카드 추가
  const targetPlayer = players[(turnIndex + 1) % players.length];

  if (additionalDraw > 0) {
    const drawCards = deck.splice(0, additionalDraw);

    hands[targetPlayer] = [...(hands[targetPlayer] ?? []), ...drawCards];
  }

  await updateDoc(roomRef, {
    hands,
    discardPile,
    deck,
    turnIndex: nextTurnIndex,
    forcedColor: card.color === 'wild' ? forcedColor : null,
  });

  console.log(`🃏 ${playerId} → 카드 냄:`, card);
};
