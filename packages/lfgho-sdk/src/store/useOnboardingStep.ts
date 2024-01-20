import { create } from 'zustand';

interface useOnboardingStepState {
    onboartdingStep: number;
    increaseOnboardingStep: () => void;
}

export const useOnboardingStep = create<useOnboardingStepState>((set) => ({
    onboartdingStep: 0,
    increaseOnboardingStep: () =>
        set((state) => ({ onboartdingStep: state.onboartdingStep + 1 }))
}));
