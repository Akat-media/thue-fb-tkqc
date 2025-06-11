import { create } from "zustand";
import BaseHeader from "../api/BaseHeader";

interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  points: number;
  role?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
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
      if (!objetUser) return;

      const userParse = JSON.parse(objetUser || "{}");
      if (!userParse.user_id) {
        console.error("Không tìm thấy user_id trong localStorage");
        return;
      }

      // console.log("Fetching user with ID:", userParse.user_id);
      const res = await BaseHeader({
        url: `user/${userParse.user_id}`,
      });

      // console.log("User data response:", res.data);
      set({ user: res.data.data });
    } catch (err) {
      console.error("Lỗi fetch user:", err);
      // Không xóa user state nếu có lỗi
      // set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
