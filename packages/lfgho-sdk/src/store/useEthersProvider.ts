import { ethers } from 'ethers';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EtherProvider =
    | ethers.providers.FallbackProvider
    | ethers.providers.JsonRpcProvider;

interface EtherProviderState {
    ethersProvider: EtherProvider | undefined;
    setEtherProvider: (etherProvider: EtherProvider | undefined) => void;
}

export const useEthersProvider = create<EtherProviderState>()(
    persist(
        (set) => ({
            ethersProvider: undefined,
            setEtherProvider: (ethersProvider: EtherProvider | undefined) =>
                set({ ethersProvider })
        }),
        { name: 'lfgho/signer' }
    )
);
