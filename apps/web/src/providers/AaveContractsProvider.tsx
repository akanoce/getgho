import {
    Pool,
    UiIncentiveDataProvider,
    UiPoolDataProvider
} from '@aave/aave-utilities/packages/contract-helpers';
import { AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import { createContext, useContext, useMemo } from 'react';
import { useLfghoClients } from '@repo/lfgho-sdk';

interface CurrentUserContextType {
    poolDataProviderContract: UiPoolDataProvider | null;
    incentiveDataProviderContract: UiIncentiveDataProvider | null;
    chainAddressBook: typeof AaveV3Sepolia;
    poolContract: Pool | null;
}

const AaveContractsContext = createContext<CurrentUserContextType | null>(null);

export const AaveContractsProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { ethersProvider } = useLfghoClients();

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
                      chainId: chainAddressBook.CHAIN_ID
                  })
                : null,
        [ethersProvider, chainAddressBook]
    );

    const poolContract = useMemo(
        () =>
            ethersProvider
                ? new Pool(ethersProvider, {
                      POOL: chainAddressBook.POOL, // Goerli GHO market
                      WETH_GATEWAY: chainAddressBook.WETH_GATEWAY // Goerli GHO market
                  })
                : null,
        [ethersProvider, chainAddressBook]
    );

    const data = useMemo(
        () => ({
            poolDataProviderContract,
            incentiveDataProviderContract,
            chainAddressBook,
            poolContract
        }),
        [
            poolDataProviderContract,
            incentiveDataProviderContract,
            chainAddressBook,
            poolContract
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
