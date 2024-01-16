import { WalletClient } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SignerState {
    viemSigner: WalletClient | undefined;
    setViemSigner: (signer: WalletClient | undefined) => void;
}

export const useViemSigner = create<SignerState>()(
    persist(
        (set) => ({
            viemSigner: undefined,
            setViemSigner: (viemSigner: WalletClient | undefined) =>
                set({ viemSigner })
        }),
        { name: 'lfgho/ViemSigner' }
    )
);
