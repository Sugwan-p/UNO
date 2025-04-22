import type { Card, CardColor } from '@/types/uno';

import { create } from 'zustand';

import { createDeck, shuffleDeck } from '@/utils/unoLogic';

interface UnoState {
  deck: Card[];
  discardPile: Card[];
  playerHands: Card[][];
  currentPlayer: number;
  forcedColor: CardColor | null;
  winner: number | null;
  initializeGame: (playerCount: number) => void;
  playCard: (playerIndex: number, cardIndex: number) => void;
  drawCard: (playerIndex: number) => void;
  nextPlayer: () => void;
  setForcedColor: (color: CardColor | null) => void;
  setWinner: (index: number | null) => void;
}

export const useUnoStore = create<UnoState>((set, get) => ({
  deck: [],
  discardPile: [],
  playerHands: [],
  currentPlayer: 0,
  forcedColor: null,
  winner: null,

  initializeGame: (playerCount) => {
    const deck = shuffleDeck(createDeck());
    const playerHands = Array.from({ length: playerCount }, () =>
      deck.splice(0, 7),
    );
    const discardPile = [deck.shift()!];

    set({
      deck,
      playerHands,
      discardPile,
      currentPlayer: 0,
      forcedColor: null,
      winner: null,
    });
  },

  playCard: (playerIndex, cardIndex) => {
    const { playerHands, discardPile, forcedColor } = get();
    const card = playerHands[playerIndex].splice(cardIndex, 1)[0];

    discardPile.unshift(card);

    if (forcedColor && card.color !== 'wild') {
      set({ forcedColor: null }); // 색 지정 해제
    }

    if (playerHands[playerIndex].length === 0) {
      set({ discardPile, playerHands, winner: playerIndex });

      return;
    }

    set({ discardPile, playerHands });
  },

  drawCard: (playerIndex) => {
    const { deck, playerHands } = get();

    if (deck.length === 0) return;
    playerHands[playerIndex].push(deck.shift()!);
    set({ deck, playerHands });
  },

  nextPlayer: () => {
    const { currentPlayer, playerHands } = get();

    set({ currentPlayer: (currentPlayer + 1) % playerHands.length });
  },

  setForcedColor: (color) => set({ forcedColor: color }),
  setWinner: (index) => set({ winner: index }),
}));
