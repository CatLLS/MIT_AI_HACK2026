import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LensType = 'Sarcasm' | 'Logic' | 'Silence' | 'Work' | null;

interface LaplaceState {
  // Application config
  useFallback: boolean;
  setUseFallback: (val: boolean) => void;

  // The User's Inputs
  userConstant: string | null;
  userHabit: string | null;
  userLens: LensType;
  finalAnswer: string | null;

  // The Stability Math (s = sigma + j*omega)
  level: number; // 0=Landing, 1=Dot, 2=Linear, 3=Quadratic, 4=Climax
  sigma: number; // Stability index (< 0 is stable, > 0 breaks UI)
  omega: number; // Resonance frequency (controls visual pulsing / audio pitch)

  // Actions
  setLevel: (level: number) => void;
  setSigma: (sigma: number) => void;
  setOmega: (omega: number) => void;
  
  // Setters for inputs that map to coordinates
  setConstant: (val: string) => void;
  setHabit: (val: string) => void;
  setLens: (lens: LensType) => void;
  setFinalAnswer: (val: string) => void;

  // Global reset
  resetExperience: () => void;
}

const initialState = {
  useFallback: true, // Default to using local preloads
  userConstant: null,
  userHabit: null,
  userLens: null,
  finalAnswer: null,
  level: 0,
  sigma: -1, // Start stable
  omega: 0.5, // Start with a low frequency pulse
};

export const useLaplaceStore = create<LaplaceState>()(
  persist(
    (set) => ({
      ...initialState,

      setUseFallback: (val) => set({ useFallback: val }),
      setLevel: (level) => set({ level }),
      setSigma: (sigma) => set({ sigma }),
      setOmega: (omega) => set({ omega }),

      setConstant: (val) => set({ userConstant: val, level: 1 }),
      setHabit: (val) => set({ userHabit: val, level: 2 }),
      setLens: (lens) => {
        let newSigma = 0;
        let newOmega = 1.0;
        
        // Logical choice shifts pole to left (stable), wait logic sets left-half plane
        if (lens === 'Logic') {
          newSigma = -2;
        } else if (lens === 'Sarcasm') {
          // Sarcasm pushes it to right half plane (unstable)
          newSigma = 2;
          newOmega = 2.0; // Faster vibration
        } else if (lens === 'Silence') {
          newSigma = -0.5;
          newOmega = 0.1; // low vibration
        } else if (lens === 'Work') {
          newSigma = -1;
          newOmega = 3.0; // intense frequency, but stable
        }
        
        set({ userLens: lens, level: 3, sigma: newSigma, omega: newOmega });
      },
      setFinalAnswer: (val) => set({ finalAnswer: val, level: 5, sigma: 20, omega: 20 }), // Maximum instability

      resetExperience: () => set(initialState),
    }),
    {
      name: 'laplace-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        // Only save config and user journey to local storage
        userConstant: state.userConstant,
        userHabit: state.userHabit,
        userLens: state.userLens,
        level: Math.max(0, state.level), // Don't persist beyond level climax?
        sigma: state.sigma,
        omega: state.omega,
        useFallback: state.useFallback
      }),
    }
  )
);
