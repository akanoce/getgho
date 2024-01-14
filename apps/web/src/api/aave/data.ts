import {
    ChainId,
    UiIncentiveDataProvider,
    UiPoolDataProvider
} from '@aave/contract-helpers';
import { AaveV3Ethereum } from '@bgd-labs/aave-address-book';
import { providers } from 'ethers';

/**
 *  Fetches all data needed for the Aave V3 dashboard demo
 * @param provider  The ethers provider
 * @param user  The user's ethereum address
 */
export const fetchContractData = async (
    provider: providers.Provider,
    user: string
) => {
    // View contract used to fetch all reserves data (including market base currency data), and user reserves
    // Using Aave V3 Eth Mainnet address for demo
    const poolDataProviderContract = new UiPoolDataProvider({
        uiPoolDataProviderAddress: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
        provider,
        chainId: ChainId.mainnet
    });

    // View contract used to fetch all reserve incentives (APRs), and user incentives
    // Using Aave V3 Eth Mainnet address for demo
    const incentiveDataProviderContract = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress:
            AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
        provider,
        chainId: ChainId.mainnet
    });

    // Object containing array of pool reserves and market base currency data
    // { reservesArray, baseCurrencyData }
    const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER
    });

    // Object containing array or users aave positions and active eMode category
    // { userReserves, userEmodeCategoryId }
    const userReserves =
        await poolDataProviderContract.getUserReservesHumanized({
            lendingPoolAddressProvider: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
            user
        });

    // Array of incentive tokens with price feed and emission APR
    const reserveIncentives =
        await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER
        });

    // Dictionary of claimable user incentives
    const userIncentives =
        await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized(
            {
                lendingPoolAddressProvider:
                    AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
                user
            }
        );

    console.log({ reserves, userReserves, reserveIncentives, userIncentives });
};
