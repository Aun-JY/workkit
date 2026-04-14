import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameDataState {
  savedMenus: string[] | null;
  savedRouletteItems: string[] | null;
  savedLadderParticipants: string[] | null;
  savedLadderResults: string[] | null;
  savedTeamInput: string | null;
  setSavedMenus: (menus: string[]) => void;
  setSavedRouletteItems: (items: string[]) => void;
  setSavedLadderParticipants: (names: string[]) => void;
  setSavedLadderResults: (results: string[]) => void;
  setSavedTeamInput: (input: string) => void;
}

export const useGameData = create<GameDataState>()(
  persist(
    (set) => ({
      savedMenus: null,
      savedRouletteItems: null,
      savedLadderParticipants: null,
      savedLadderResults: null,
      savedTeamInput: null,
      setSavedMenus: (menus) => set({ savedMenus: menus }),
      setSavedRouletteItems: (items) => set({ savedRouletteItems: items }),
      setSavedLadderParticipants: (names) => set({ savedLadderParticipants: names }),
      setSavedLadderResults: (results) => set({ savedLadderResults: results }),
      setSavedTeamInput: (input) => set({ savedTeamInput: input }),
    }),
    { name: 'workkit-game-data' }
  )
);
