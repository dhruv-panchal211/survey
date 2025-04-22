import create from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

interface Poll {
  id: string;
  tc_number: string;
  poll_number: string;
  latitude: number;
  longitude: number;
  span_length?: number;
  created_at: string;
}

interface PollState {
  currentPoll: Poll | null;
  loading: boolean;
  error: string | null;
  submitPoll: (pollData: Omit<Poll, 'id' | 'created_at' | 'span_length'>) => Promise<void>;
}

export const usePollStore = create<PollState>((set) => ({
  currentPoll: null,
  loading: false,
  error: null,
  submitPoll: async (pollData) => {
    try {
      set({ loading: true });
      const response = await axios.post(`${API_URL}/submit-poll`, pollData);
      set({ currentPoll: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));