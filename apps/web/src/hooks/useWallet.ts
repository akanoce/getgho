import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
    wallet: string | undefined;
    setWallet: (wallet: string | undefined) => void;
}

export const useWallet = create<WalletState>()(
    persist(
        (set) => ({
            wallet: undefined,
            setWallet: (wallet: string | undefined) => set({ wallet })
        }),
        { name: 'lfgho/wallet' }
    )
);
