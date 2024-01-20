import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface useSponsoredTxFlagState {
    isSponsoredTx: boolean;
    setIsSPonsored: (isSponsoredTx: boolean) => void;
}

export const useSponsoredTxFlag = create<useSponsoredTxFlagState>()(
    persist(
        (set) => ({
            isSponsoredTx: false,
            setIsSPonsored: (isSponsoredTx: boolean) => set({ isSponsoredTx })
        }),
        { name: 'lfgho/isSponsored' }
    )
);
