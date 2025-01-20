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
      subs_id: '',
      subs_type: '',
      subs_state: '',

      login: (user_email, user_name, user_tier, user_id, token) => {
        set({ user_email, user_name, user_tier, user_id, token });
      },

      changePlan: (user_tier, token) => {
        set({ user_tier, token });
      },

      changeToken: (token) => {
        set({ token });
      },
    
      changeSubs: (subs_id, subs_type, subs_state) => {
        set({ subs_id, subs_type, subs_state});
      },

      logout: () => {
        set({
          user_id: '',
          user_name: '',
          user_email: '',
          user_tier: '',
          token: null,
          subs_id: '',
          subs_type: '',
          subs_state: '',
        });
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);