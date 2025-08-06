import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  username: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, username: string, token: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "llm_web_auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      login: (email, username, token) => {
        set({
          isLoggedIn: true,
          user: { email, username },
          token,
        });
      },

      logout: () => {
        set({ isLoggedIn: false, user: null, token: null });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
