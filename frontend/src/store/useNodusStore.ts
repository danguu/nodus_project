import { create } from 'zustand';
import { User } from '@/types';

interface NodusStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useNodusStore = create<NodusStore>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('nodus_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('nodus_token');
    set({ user: null, token: null });
  },
}));
