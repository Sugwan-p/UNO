'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

import { enterRoom } from '@/utils/firestore/enterRoomApi';
import { createRoom } from '@/utils/firestore/roomApi';
import { db } from '@/firebase/config';

interface RoomInfo {
  id: string;
  players: string[];
  joined: string[];
  started?: boolean;
}

const TestPage = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [newRoomId, setNewRoomId] = useState('');
  const [playerCount, setPlayerCount] = useState(2);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'rooms'), async (snapshot) => {
      const updates: RoomInfo[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;

        if (Array.isArray(data.joined) && data.joined.length === 0) continue;

        const room: RoomInfo = {
          id,
          players: data.players,
          joined: data.joined ?? [],
          started: data.started ?? false,
        };

        updates.push(room);
      }

      setRooms(updates);
    });

    return () => unsub();
  }, []);

  const handleEnterRoom = async (roomId: string) => {
    const ref = doc(db, 'rooms', roomId);
    const snap = await getDoc(ref);
    const room = snap.data() as RoomInfo;

    if (room.started) {
      alert('이미 시작된 게임입니다!');

      return;
    }

    const playerId = await enterRoom(roomId);

    if (playerId) {
      router.push(`/room/${roomId}?player=${playerId}`);
    } else {
      alert('⚠️ 이 방은 이미 가득 찼습니다.');
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomId || playerCount < 2 || playerCount > 4) {
      alert('방 이름을 입력하고 인원 수는 2~4명이어야 합니다.');

      return;
    }

    const players = Array.from(
      { length: playerCount },
      (_, i) => `player${i + 1}`,
    );

    const ref = doc(db, 'rooms', newRoomId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await createRoom(newRoomId, players);
      await updateDoc(ref, {
        joined: ['player1'],
        started: false,
      });

      setNewRoomId('');
      setPlayerCount(2);
      router.push(`/room/${newRoomId}?player=player1`);
    } else {
      alert('⚠️ 이미 존재하는 방 이름입니다.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🎮 방 선택</h1>

      <div className="space-y-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            className="w-full px-4 py-2 text-mono_900 dark:text-mono_100 bg-gray-100 dark:bg-mono_900 border border-gray-300 dark:border-mono_700 rounded text-left"
            disabled={room.started}
            onClick={() => handleEnterRoom(room.id)}
          >
            <div className="flex justify-between">
              <span>🧩 {room.id}</span>
              <span className="text-sm text-gray-600">
                {room.joined?.length ?? 0} / {room.players.length}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold mb-2">➕ 새로운 방 만들기</h2>
        <input
          className="border px-2 py-1 rounded mr-2"
          placeholder="방 이름"
          type="text"
          value={newRoomId}
          onChange={(e) => setNewRoomId(e.target.value)}
        />
        <select
          className="border px-2 py-1 rounded mr-2"
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
        >
          <option value={2}>2명</option>
          <option value={3}>3명</option>
          <option value={4}>4명</option>
        </select>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleCreateRoom}
        >
          방 만들기
        </button>
      </div>
    </div>
  );
};

export default TestPage;
