import {
    UiIncentiveDataProvider,
    UiPoolDataProvider
} from '@aave/contract-helpers';
import { AaveV3Sepolia } from '@bgd-labs/aave-address-book';

/**
 * Fetches pool reserves and market base currency data from the Aave V3 UI Pool Data Provider contract
 * @param poolDataProviderContract   The Aave V3 UI Pool Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @returns  Object containing array of pool reserves and market base currency data
 */
export const getReserves = async (
    poolDataProviderContract: UiPoolDataProvider,
    chainAddressBook: typeof AaveV3Sepolia
) => {
    // Object containing array of pool reserves and market base currency data
    // { reservesArray, baseCurrencyData }
    const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER
    });
    return reserves;
};

/**
 * Fetches user reserves and active eMode category from the Aave V3 UI Pool Data Provider contract
 * @param poolDataProviderContract  The Aave V3 UI Pool Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param user  The user's ethereum address
 * @returns  Object containing array of pool reserves and market base currency data
 */
export const getUserReserves = async (
    poolDataProviderContract: UiPoolDataProvider,
    chainAddressBook: typeof AaveV3Sepolia,
    user: string
) => {
    // Object containing array or users aave positions and active eMode category
    // { userReserves, userEmodeCategoryId }
    const reserves = await poolDataProviderContract.getUserReservesHumanized({
        lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER,
        user
    });
    return reserves;
};

/**
 *
 * @param incentiveDataProviderContract  The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @returns
 */
export const getReservesIncentives = async (
    incentiveDataProviderContract: UiIncentiveDataProvider,
    chainAddressBook: typeof AaveV3Sepolia
) => {
    // Array of incentive tokens with price feed and emission APR
    const reserves =
        await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER
        });
    return reserves;
};

/**
 *
 * @param incentiveDataProviderContract  The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param user  The user's ethereum address
 * @returns
 */
export const getUserReservesIncentives = async (
    incentiveDataProviderContract: UiIncentiveDataProvider,
    chainAddressBook: typeof AaveV3Sepolia,
    user: string
) => {
    // Dictionary of claimable user incentives
    const reserves =
        await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized(
            {
                lendingPoolAddressProvider:
                    chainAddressBook.POOL_ADDRESSES_PROVIDER,
                user
            }
        );
    return reserves;
};
