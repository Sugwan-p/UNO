'use client';

import GameTable from '@/components/organisms/GameTable';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-mono_100">
      <h1 className="text-3xl font-bold mb-8 text-main">UNO 게임 🎲</h1>
      <GameTable />
    </main>
  );
}
