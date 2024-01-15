import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocalAccount } from 'viem';

interface WalletState {
    wallet: LocalAccount | undefined;
    setWallet: (wallet: LocalAccount | undefined) => void;
}

export const useWallet = create<WalletState>()(
    persist(
        (set) => ({
            wallet: undefined,
            setWallet: (wallet: LocalAccount | undefined) => set({ wallet })
        }),
        { name: 'lfgho/wallet' }
    )
);
