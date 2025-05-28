import { create } from "zustand";
import BaseHeader from "../api/BaseHeader";

interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  points: number;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const objetUser = localStorage.getItem("user");
      const userParse = JSON.parse(objetUser || "{}");
      const res = await BaseHeader({
        url: `user/${userParse.user_id}`,
      });
      set({ user: res.data.data });
    } catch (err) {
      console.error("Lỗi fetch user:", err);
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
