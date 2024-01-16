import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hex } from 'viem';

interface CounterFactualAddressState {
    addressRecords: Record<string, Hex> | undefined;
    setAddressRecords: (
        addressRecords: Record<string, Hex> | undefined
    ) => void;
}

export const useCounterFactualAddress = create<CounterFactualAddressState>()(
    persist(
        (set) => ({
            addressRecords: undefined,
            setAddressRecords: (
                addressRecords: Record<string, Hex> | undefined
            ) =>
                set((prev) => ({
                    ...prev,
                    addressRecords
                }))
        }),
        { name: 'lfgho/wallet' }
    )
);
