import type { Card } from '@/types/uno';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import { db } from '@/firebase/config';

interface RoomState {
  players: string[];
  hands: Record<string, Card[]>;
  deck: Card[];
  discardPile: Card[];
  turnIndex: number;
  forcedColor: string | null;
  winner: string | null;
  started?: boolean;
  joined?: string[];
}

export const useRoomSync = (roomId: string) => {
  const [room, setRoom] = useState<RoomState | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const ref = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      try {
        if (!snap.exists()) return;

        const data = snap.data() as RoomState;

        setRoom(data);
      } catch {}
    });

    return () => unsubscribe();
  }, [roomId]);

  return room;
};
