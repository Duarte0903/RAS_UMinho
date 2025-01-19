import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSessionStore = create(
  persist(
    (set) => ({
      user_id: '',
      user_name: '',
      user_email: '',
      user_tier: '',
      token: null,

      login: (user_email, user_name, user_tier, user_id, token) => {
        set({ user_email, user_name, user_tier, user_id, token });
      },

      changePlan: (user_tier) => {
        set({ user_tier });
      },

      logout: () => {
        set({
          user_id: '',
          user_name: '',
          user_email: '',
          user_tier: '',
          token: null,
        });
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);