import { create } from 'zustand';

export const useFeederStore = create((set) => ({
  feederId: null,
  setFeederId: (id) => set({ feederId: id }),
}));
