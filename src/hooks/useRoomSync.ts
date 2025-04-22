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
        console.log('📡 실시간 감지됨!', snap.exists());
        if (!snap.exists()) return;

        const data = snap.data() as RoomState;

        setRoom(data);
      } catch (error) {
        console.error('❌ Firestore 실시간 감지 중 오류 발생:', error);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  return room;
};
