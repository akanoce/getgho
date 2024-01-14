import { WalletClient } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SignerState {
    signer: WalletClient | undefined;
    setSigner: (signer: WalletClient | undefined) => void;
}

export const useSigner = create<SignerState>()(
    persist(
        (set) => ({
            signer: undefined,
            setSigner: (signer: WalletClient | undefined) => set({ signer })
        }),
        { name: 'lfgho/signer' }
    )
);
