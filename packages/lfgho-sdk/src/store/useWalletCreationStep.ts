import { create } from 'zustand';

export enum WalletCreationStep {
    Initial = 0,
    CreatingWallet = 1,
    RequestingSignature = 2,
    DeployingWallet = 3,
    LoadingWallet = 4
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
