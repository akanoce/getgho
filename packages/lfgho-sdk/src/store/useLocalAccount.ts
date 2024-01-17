import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocalAccount } from 'viem';

interface LocalAccountState {
    localAccount: LocalAccount | undefined;
    setLocalAccount: (wallet: LocalAccount | undefined) => void;
}

export const useLocalAccount = create<LocalAccountState>()(
    persist(
        (set) => ({
            localAccount: undefined,
            setLocalAccount: (localAccount: LocalAccount | undefined) =>
                set({ localAccount })
        }),
        { name: 'lfgho/LocalAccount' }
    )
);
