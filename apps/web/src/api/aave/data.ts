import {
    ReserveDataHumanized,
    ReservesDataHumanized,
    ReservesIncentiveDataHumanized,
    UiIncentiveDataProvider,
    UiPoolDataProvider,
    UserReserveDataHumanized
} from '@aave/contract-helpers';
import {
    FormatReserveUSDResponse,
    FormatUserSummaryResponse,
    formatReserves,
    formatReservesAndIncentives,
    formatUserSummary,
    formatUserSummaryAndIncentives
} from '@aave/math-utils';
import { AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import dayjs from 'dayjs';

type GetReservesResponse = {
    reserves: ReservesDataHumanized;
    formattedReserves: (ReserveDataHumanized & FormatReserveUSDResponse)[];
};
/**
 * Fetches pool reserves and market base currency data from the Aave V3 UI Pool Data Provider contract
 * @param poolDataProviderContract   The Aave V3 UI Pool Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @returns  Object containing array of pool reserves and market base currency data
 */
export const getReserves = async (
    poolDataProviderContract: UiPoolDataProvider,
    chainAddressBook: typeof AaveV3Sepolia
): Promise<GetReservesResponse> => {
    // Object containing array of pool reserves and market base currency data
    // { reservesArray, baseCurrencyData }
    const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER
    });
    return {
        reserves,
        formattedReserves: formatReserves({
            reserves: reserves.reservesData,
            currentTimestamp: dayjs().unix(),
            marketReferenceCurrencyDecimals:
                reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd:
                reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd
        })
    };
};

type GetUserReservesResponse = {
    userReserves: {
        userReserves: UserReserveDataHumanized[];
        userEmodeCategoryId: number;
    };
    formattedReserves: FormatUserSummaryResponse<
        ReserveDataHumanized & FormatReserveUSDResponse
    >;
};
/**
 * Fetches user reserves and active eMode category from the Aave V3 UI Pool Data Provider contract
 * @param poolDataProviderContract  The Aave V3 UI Pool Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param user  The user's ethereum address
 * @param reservesResponse  The response from the getReserves function
 * @returns  Object containing array of pool reserves and market base currency data
 */
export const getUserReserves = async (
    poolDataProviderContract: UiPoolDataProvider,
    chainAddressBook: typeof AaveV3Sepolia,
    user: string,
    reservesResponse: GetReservesResponse
): Promise<GetUserReservesResponse> => {
    // Object containing array or users aave positions and active eMode category
    // { userReserves, userEmodeCategoryId }
    const userReserves =
        await poolDataProviderContract.getUserReservesHumanized({
            lendingPoolAddressProvider:
                chainAddressBook.POOL_ADDRESSES_PROVIDER,
            user
        });

    return {
        userReserves,
        formattedReserves: formatUserSummary({
            userReserves: userReserves.userReserves,
            userEmodeCategoryId: userReserves.userEmodeCategoryId,
            currentTimestamp: dayjs().unix(),
            marketReferenceCurrencyDecimals:
                reservesResponse.reserves.baseCurrencyData
                    .marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd:
                reservesResponse.reserves.baseCurrencyData
                    .marketReferenceCurrencyPriceInUsd,
            formattedReserves: reservesResponse.formattedReserves
        })
    };
};

type GetReservesIncentives = {
    reserveIncentives: ReservesIncentiveDataHumanized[];
    formattedReservesIncentives: (ReserveDataHumanized &
        FormatReserveUSDResponse)[];
};

/**
 *
 * @param incentiveDataProviderContract  The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param reservesResponse  The response from the getReserves function
 * @returns
 */
export const getReservesIncentives = async (
    incentiveDataProviderContract: UiIncentiveDataProvider,
    chainAddressBook: typeof AaveV3Sepolia,
    reservesResponse: GetReservesResponse
): Promise<GetReservesIncentives> => {
    // Array of incentive tokens with price feed and emission APR
    const reserveIncentives =
        await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER
        });

    return {
        reserveIncentives,
        formattedReservesIncentives: formatReservesAndIncentives({
            reserves: reservesResponse.reserves.reservesData,
            reserveIncentives,
            currentTimestamp: dayjs().unix(),
            marketReferenceCurrencyDecimals:
                reservesResponse.reserves.baseCurrencyData
                    .marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd:
                reservesResponse.reserves.baseCurrencyData
                    .marketReferenceCurrencyPriceInUsd
        })
    };
};

/**
 *
 * @param incentiveDataProviderContract  The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param user  The user's ethereum address
 * @param reservesIncentivesResponse  The response from the getReserves function
 * @returns
 */
export const getUserReservesIncentives = async (
    incentiveDataProviderContract: UiIncentiveDataProvider,
    chainAddressBook: typeof AaveV3Sepolia,
    user: string,
    reservesResponse: GetReservesResponse,
    reserveIncentivesResponse: GetReservesIncentives,
    userReserves: GetUserReservesResponse
) => {
    // Dictionary of claimable user incentives
    const userReservesIncentives =
        await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized(
            {
                lendingPoolAddressProvider:
                    chainAddressBook.POOL_ADDRESSES_PROVIDER,
                user
            }
        );
    return {
        userReservesIncentives,
        formattedUserSummary: formatUserSummaryAndIncentives({
            currentTimestamp: dayjs().unix(),
            marketReferenceCurrencyDecimals:
                reservesResponse.reserves.baseCurrencyData
                    .marketReferenceCurrencyDecimals,
            marketReferencePriceInUsd:
                reservesResponse.reserves.baseCurrencyData
                    .marketReferenceCurrencyPriceInUsd,
            userReserves: userReserves.userReserves.userReserves,
            userEmodeCategoryId: userReserves.userReserves.userEmodeCategoryId,
            formattedReserves: reservesResponse.formattedReserves,
            reserveIncentives: reserveIncentivesResponse.reserveIncentives,
            userIncentives: userReservesIncentives
        })
    };
};
