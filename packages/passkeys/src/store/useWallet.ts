import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TWalletDetails } from '../model';

interface WalletState {
    wallet: TWalletDetails | undefined;
    setWallet: (wallet: TWalletDetails | undefined) => void;
}

export const useWallet = create<WalletState>()(
    persist(
        (set) => ({
            wallet: undefined,
            setWallet: (wallet: TWalletDetails | undefined) => set({ wallet })
        }),
        { name: 'lfgho/wallet' }
    )
);
