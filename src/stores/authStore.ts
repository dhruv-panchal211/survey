import { create } from 'zustand';
import axios  from 'axios';
import { API_URL } from '../config';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  login: async (phone: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { number:phone, password });
      console.log({API_URL, phone, password, response})
      const { token } = response.data;
      set({ token, isAuthenticated: true });
    } catch (error) {
      console.log({error})
      throw new Error('Login failed');
    }
  },
  register: async (phone: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { phone, password });
      const { token } = response.data;
      set({ token, isAuthenticated: true });
    } catch (error) {
      throw new Error('Registration failed');
    }
  },
  logout: () => {
    set({ token: null, isAuthenticated: false });
  },
}));