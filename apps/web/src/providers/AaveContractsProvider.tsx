import {
    ChainId,
    UiIncentiveDataProvider,
    UiPoolDataProvider
} from '@aave/contract-helpers';
import { AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import { useTurnkeySigner } from '@repo/passkeys';
import { createContext, useContext, useMemo } from 'react';
import { config } from '@repo/config';

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
    const { ethersProvider } = useTurnkeySigner(config);
    //TODO: support multiple chains
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
