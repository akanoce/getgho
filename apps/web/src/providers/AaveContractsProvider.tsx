import {
    ChainId,
    UiIncentiveDataProvider,
    UiPoolDataProvider
} from '@aave/contract-helpers';
import { AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLfghoClients } from '@repo/lfgho-sdk';
import { Transport, WalletClient } from 'viem';
import { ethers } from 'ethers';

interface CurrentUserContextType {
    poolDataProviderContract: UiPoolDataProvider | null;
    incentiveDataProviderContract: UiIncentiveDataProvider | null;
    chainAddressBook: typeof AaveV3Sepolia;
}

const AaveContractsContext = createContext<CurrentUserContextType | null>(null);

export const AaveContractsProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { viemSigner } = useLfghoClients();

    const clientToProvider = useCallback((client: WalletClient) => {
        const { chain, transport } = client;
        if (!chain) throw new Error('Chain not found');
        const network = {
            chainId: chain.id,
            name: chain.name,
            ensAddress: chain.contracts?.ensRegistry?.address
        };
        if (transport.type === 'fallback')
            return new ethers.providers.FallbackProvider(
                (transport.transports as ReturnType<Transport>[]).map(
                    ({ value }) =>
                        new ethers.providers.JsonRpcProvider(
                            value?.url,
                            network
                        )
                )
            );
        return new ethers.providers.JsonRpcProvider(
            { url: transport.url, headers: transport.fetchOptions.headers },
            network
        );
    }, []);

    const ethersProvider = useMemo(
        () => clientToProvider(viemSigner),
        [clientToProvider, viemSigner]
    );

    const chainAddressBook = useMemo(() => AaveV3Sepolia, []);

    // View contract used to fetch all reserves data (including market base currency data), and user reserves
    // Using Aave V3 Eth Mainnet address for demo
    const poolDataProviderContract = useMemo(
        () =>
            ethersProvider
                ? new UiPoolDataProvider({
                      uiPoolDataProviderAddress:
                          chainAddressBook.UI_POOL_DATA_PROVIDER,
                      provider: ethersProvider,
                      chainId: chainAddressBook.CHAIN_ID
                  })
                : null,
        [ethersProvider, chainAddressBook]
    );

    // View contract used to fetch all reserve incentives (APRs), and user incentives
    // Using Aave V3 Eth Mainnet address for demo
    const incentiveDataProviderContract = useMemo(
        () =>
            ethersProvider
                ? new UiIncentiveDataProvider({
                      uiIncentiveDataProviderAddress:
                          chainAddressBook.UI_INCENTIVE_DATA_PROVIDER,
                      provider: ethersProvider,
                      chainId: ChainId.sepolia
                  })
                : null,
        [ethersProvider, chainAddressBook]
    );

    const data = useMemo(
        () => ({
            poolDataProviderContract,
            incentiveDataProviderContract,
            chainAddressBook
        }),
        [
            poolDataProviderContract,
            incentiveDataProviderContract,
            chainAddressBook
        ]
    );
    return (
        <AaveContractsContext.Provider value={data}>
            {children}
        </AaveContractsContext.Provider>
    );
};

export const useAaveContracts = () => {
    const context = useContext(AaveContractsContext);

    if (!context)
        throw new Error(
            'AaveContractsContext has to be used within <AaveContractsContext.Provider>'
        );

    return context;
};
