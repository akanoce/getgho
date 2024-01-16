import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import {
    PimlicoBundlerClient,
    PimlicoPaymasterClient
} from 'permissionless/clients/pimlico';
import { PublicClient, WalletClient } from 'viem';
import { useEthersProvider, useViemSigner } from '../store';
import { getViemPublicClient } from '../_viem';
import {
    getPimlicoBundlerClient,
    getPimlicoPaymasterClient
} from '../_pimlico';

type LfghoContextProviderProps = { children: React.ReactNode };

export type LfghoContextType = {
    viemSigner: WalletClient;
    ethersProvider:
        | ethers.providers.FallbackProvider
        | ethers.providers.JsonRpcProvider;
    viemPublicClient: PublicClient;
    pimlicoBundler: PimlicoBundlerClient;
    pimlicoPaymaster: PimlicoPaymasterClient;
};

export const LfghoContext = React.createContext<LfghoContextType | undefined>(
    undefined
);

const LfghoContextProvider = ({ children }: LfghoContextProviderProps) => {
    const { viemSigner } = useViemSigner();
    const { ethersProvider } = useEthersProvider();

    const [viemPublicClient, setViemPublicClient] = useState<
        PublicClient | undefined
    >();
    const [pimlicoBundler, setPimlicoBundler] = useState<
        PimlicoBundlerClient | undefined
    >();
    const [pimlicoPaymaster, setPimlicoPaymaster] = useState<
        PimlicoPaymasterClient | undefined
    >();

    const value = useMemo(() => {
        if (
            viemSigner &&
            ethersProvider &&
            viemPublicClient &&
            pimlicoBundler &&
            pimlicoPaymaster
        ) {
            return {
                viemSigner,
                ethersProvider,
                viemPublicClient,
                pimlicoBundler,
                pimlicoPaymaster
            };
        }

        return undefined;
    }, []);

    const init = useCallback(() => {
        if (!value) {
            // init all clientes and save to state

            const _viemPublic = getViemPublicClient();
            setViemPublicClient(_viemPublic);

            const _pimlicoBundler = getPimlicoBundlerClient();
            setPimlicoBundler(_pimlicoBundler);

            const _pimlicoPaymaster = getPimlicoPaymasterClient();
            setPimlicoPaymaster(_pimlicoPaymaster);
        }
    }, [value]);

    useEffect(() => {
        init;
    }, []);

    return (
        <LfghoContext.Provider value={value}>{children}</LfghoContext.Provider>
    );
};

export { LfghoContextProvider };
