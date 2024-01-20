import { create } from 'zustand';

export enum WalletCreationStep {
    Initial = 0,
    CreatingWallet = 1,
    DeployingWallet = 2
}

interface useWalletCreationStepState {
    walletCreationStep: WalletCreationStep;
    setWalletCreationStep: (walletCreationStep: WalletCreationStep) => void;
}

export const useWalletCreationStep = create<useWalletCreationStepState>(
    (set) => ({
        walletCreationStep: WalletCreationStep.Initial,
        setWalletCreationStep: (walletCreationStep: WalletCreationStep) =>
            set({ walletCreationStep })
    })
);
