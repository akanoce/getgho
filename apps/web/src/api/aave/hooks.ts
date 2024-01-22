import { useAaveContracts } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import {
    getReserves,
    getReservesIncentives,
    getUserReserves,
    getUserReservesIncentives
} from '.';
import { CryptoIconMap, genericCryptoIcon } from '@/const/icons';
import { erc20ABI, useContractReads } from 'wagmi';
import { formatUnits } from 'viem';
import { useCallback } from 'react';

/**
 * see {@link getReserves}
 * @returns
 */
export const useReserves = () => {
    const { poolDataProviderContract, chainAddressBook } = useAaveContracts();

    const enabled = !!poolDataProviderContract && !!chainAddressBook;
    return useQuery({
        queryKey: ['aave', 'reserves'],
        queryFn: async () =>
            enabled
                ? await getReserves(poolDataProviderContract, chainAddressBook)
                : null,
        enabled
    });
};

/**
 * see {@link getUserReserves}
 * @param user
 * @returns
 */
export const useUserReserves = (user?: string) => {
    const { poolDataProviderContract, chainAddressBook } = useAaveContracts();

    const { data: reserves } = useReserves();

    const enabled =
        !!poolDataProviderContract &&
        !!chainAddressBook &&
        !!user &&
        !!reserves;
    return useQuery({
        queryKey: ['aave', 'reserves', user],
        queryFn: async () =>
            enabled
                ? await getUserReserves(
                      poolDataProviderContract,
                      chainAddressBook,
                      user,
                      reserves
                  )
                : null,
        enabled
    });
};

/**
 *  see {@link getReservesIncentives}
 * @returns
 */
export const useReservesIncentives = () => {
    const { incentiveDataProviderContract, chainAddressBook } =
        useAaveContracts();

    const { data: reserves } = useReserves();

    const enabled =
        !!incentiveDataProviderContract && !!chainAddressBook && !!reserves;

    return useQuery({
        queryKey: ['aave', 'reserves', 'incentives'],
        queryFn: async () =>
            enabled
                ? await getReservesIncentives(
                      incentiveDataProviderContract,
                      chainAddressBook,
                      reserves
                  )
                : null,
        enabled
    });
};

/**
 * see {@link getUserReservesIncentives}
 * @param user  The user's ethereum address
 * @returns
 */
export const useUserReservesIncentives = (user?: string) => {
    const { incentiveDataProviderContract, chainAddressBook } =
        useAaveContracts();

    const { data: reserves } = useReserves();
    const { data: reservesIncentives } = useReservesIncentives();
    const { data: userReserves } = useUserReserves(user);

    const enabled =
        !!incentiveDataProviderContract &&
        !!chainAddressBook &&
        !!user &&
        !!reserves &&
        !!reservesIncentives &&
        !!userReserves;

    return useQuery({
        queryKey: ['aave', 'reserves', 'incentives', user],
        queryFn: async () =>
            enabled
                ? await getUserReservesIncentives(
                      incentiveDataProviderContract,
                      chainAddressBook,
                      user,
                      reserves,
                      reservesIncentives,
                      userReserves
                  )
                : null,
        enabled
    });
};

export type MergedAsset = {
    id: string;
    symbol: string;
    name: string;
    tokenImage: string;
    price: string;
    availableBalance: string;
    availableBalanceUSD: number;
    supplyAPY: string;
    suppliedBalance: string;
    suppliedBalanceUSD: string;
    borrowAPY: string;
    borrowedBalance: string;
    borrowedBalanceUSD: string;
    isIsolated: boolean;
};
export const useMergedTableData = ({
    address,
    showAll = false,
    showIsolated = false,
    showGho = false
}: {
    address: string;
    showAll?: boolean;
    showIsolated?: boolean;
    showGho?: boolean;
}) => {
    const { data: userReserves, ...otherResultProps } =
        useUserReservesIncentives(address);

    const assetsData =
        userReserves?.formattedUserSummary.userReservesData || [];

    const { data: userBalances } = useContractReads({
        allowFailure: false,
        contracts: assetsData?.map((assetData) => ({
            address: assetData.underlyingAsset as `0x${string}`,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [address]
        }))
    });

    const getUserBalance = useCallback(
        (assetIndex: number, decimals: number) => {
            const balance = userBalances?.[assetIndex] as bigint;
            if (!balance) return '0';

            const parsedBalance = formatUnits(balance, decimals);

            return parsedBalance;
        },
        [userBalances]
    );

    const mergedAssets: MergedAsset[] = assetsData
        .map((assetData, index) => {
            const asset = assetData.reserve;
            return {
                id: asset.id,
                symbol: asset.symbol.toUpperCase(),
                name: asset.name,
                tokenImage:
                    CryptoIconMap[asset.symbol.toUpperCase()] ??
                    genericCryptoIcon,
                price: asset.priceInUSD,
                availableBalance: getUserBalance(index, asset.decimals ?? 18),
                availableBalanceUSD:
                    Number(asset.priceInUSD) *
                    Number(getUserBalance(index, asset.decimals ?? 18)),
                supplyAPY: asset.supplyAPY,
                suppliedBalance: assetData.underlyingBalance,
                suppliedBalanceUSD: assetData.underlyingBalanceUSD,
                borrowAPY: asset.variableBorrowAPY,
                borrowedBalance: assetData.totalBorrows,
                borrowedBalanceUSD: assetData.totalBorrowsUSD,
                isIsolated: asset.isIsolated
            };
        })
        .filter(
            (asset) =>
                showAll ||
                asset.availableBalance !== '0' ||
                asset.suppliedBalance !== '0' ||
                asset.borrowedBalance !== '0'
        )
        .filter((asset) => showIsolated || !asset.isIsolated)
        .filter((asset) => showGho || !asset.symbol.includes('GHO'));

    return { data: mergedAssets, ...otherResultProps };
};

export const useGhoData = (address: string) => {
    const { data } = useMergedTableData({
        address,
        showAll: true,
        showGho: true
    });
    return data.find((asset) => asset.symbol === 'GHO');
};
