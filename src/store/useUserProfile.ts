import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfileState {
  birthYear: number | null;
  setBirthYear: (year: number | null) => void;
}

export const useUserProfile = create<UserProfileState>()(
  persist(
    (set) => ({
      birthYear: null,
      setBirthYear: (year) => set({ birthYear: year }),
    }),
    { name: 'workkit-user-profile' }
  )
);
