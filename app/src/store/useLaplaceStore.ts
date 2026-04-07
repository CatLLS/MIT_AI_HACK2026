import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LevelStage = 'LANDING' | 'TIME_DOMAIN_VIDEO' | 'CLI' | 'INTRO' | 'PRE_INTERACT' | 'INTERACT' | 'OUTRO' | 'BREAKING' | 'MONTAGE' | 'DEATH';
export type LensType = 'Sarcasm' | 'Logic' | 'Velocity' | 'Damping' | null;

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
  levelStage: LevelStage;
  sigma: number; // Stability index (< 0 is stable, > 0 breaks UI)
  omega: number; // Resonance frequency (controls visual pulsing / audio pitch)

  // Actions
  setLevel: (level: number) => void;
  setLevelStage: (stage: LevelStage) => void;
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
  levelStage: 'LANDING' as LevelStage,
  sigma: -1, // Start stable
  omega: 0.5, // Start with a low frequency pulse
};

export const useLaplaceStore = create<LaplaceState>()(
  persist(
    (set) => ({
      ...initialState,

      setUseFallback: (val) => set({ useFallback: val }),
      setLevel: (level) => set({ level }),
      setLevelStage: (stage) => set({ levelStage: stage }),
      setSigma: (sigma) => set({ sigma }),
      setOmega: (omega) => set({ omega }),

      setConstant: (val) => set({ userConstant: val, levelStage: 'INTRO' }),
      setHabit: (val) => set({ userHabit: val, levelStage: 'INTRO' }),
      setLens: (lens) => {
        let newSigma = 0;
        let newOmega = 1.0;

        if (lens === 'Logic') {
          newSigma = -2;
        } else if (lens === 'Sarcasm') {
          newSigma = 2;
          newOmega = 2.0;
        } else if (lens === 'Velocity') {
          newSigma = -1;
          newOmega = 4.0;
        } else if (lens === 'Damping') {
          newSigma = -1.5;
          newOmega = 0.5;
        }

        set({ userLens: lens, levelStage: 'INTRO', sigma: newSigma, omega: newOmega });
      },
      setFinalAnswer: (val) => set({ finalAnswer: val, levelStage: 'BREAKING', sigma: 20, omega: 20 }), // Trigger visual breakdown

      resetExperience: () => set(initialState),
    }),
    {
      name: 'laplace-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        // Only save config and user journey to local storage
        userConstant: state.userConstant,
        userHabit: state.userHabit,
        userLens: state.userLens,
        level: Math.max(0, state.level),
        sigma: state.sigma,
        omega: state.omega,
        useFallback: state.useFallback
      }),
    }
  )
);
