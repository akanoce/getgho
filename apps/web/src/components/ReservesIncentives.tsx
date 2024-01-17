import { useReservesIncentives } from '@/api';
import { Spinner } from './Spinner';
import { erc20ABI, useContractReads } from 'wagmi';
import React from 'react';
import { formatUnits } from 'viem';
import { isNil } from 'lodash';
import { AddressButton } from '.';
import { SupplyUnderlyingAssetButton } from './SupplyUnderlyingAssetButton';
type Props = {
    address: string;
};
export const ReservesIncentives: React.FC<Props> = ({ address }) => {
    const { data: reservesIncentives } = useReservesIncentives();

    const formattedReservesIncentives =
        reservesIncentives?.formattedReservesIncentives;

    const result = useContractReads({
        allowFailure: false,
        contracts: reservesIncentives?.formattedReservesIncentives.map(
            (reserveIncentive) => ({
                address: reserveIncentive.underlyingAsset as `0x${string}`,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address]
            })
        )
    });

    const getUserBalance = (assetIndex: number) => {
        return result?.data?.[assetIndex] as bigint;
    };

    const renderUnderLyingAssetBalance = (assetIndex: number) => {
        const reserveIncentive = formattedReservesIncentives?.[assetIndex];
        const balance = getUserBalance(assetIndex);

        return (
            <div className="flex flex-row items-center justify-center gap-1">
                <span className="text-sm font-semibold">
                    {isNil(balance)
                        ? 'N/A'
                        : formatUnits(
                              balance,
                              reserveIncentive?.decimals ?? 18
                          )}
                </span>
                <span className="text-sm font-medium">
                    {reserveIncentive ? reserveIncentive.symbol : 'Loading...'}
                </span>
            </div>
        );
    };

    if (!formattedReservesIncentives)
        return (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100  flex flex-col items-center justify-center h-52 gap-y-2">
                <span className="text-2xl font-bold">Reserves Incentives</span>
                <Spinner />
            </div>
        );

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100  flex flex-col gap-y-2">
            <span className="text-2xl font-bold">Reserves Incentives</span>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Token
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Available liquidity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total debt
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Your balance
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {formattedReservesIncentives.map(
                            (reserveIncentive, index) => (
                                <tr
                                    key={reserveIncentive.id}
                                    className="text-gray-900"
                                >
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-semibold text-gray-900  whitespace-nowrap"
                                    >
                                        {reserveIncentive.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        <AddressButton
                                            address={
                                                reserveIncentive.underlyingAsset
                                            }
                                            withCopy={true}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            Number(reserveIncentive.priceInUSD)
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            Number(
                                                reserveIncentive.availableLiquidityUSD
                                            )
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            Number(
                                                reserveIncentive.totalDebtUSD
                                            )
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderUnderLyingAssetBalance(index)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <SupplyUnderlyingAssetButton
                                            reserve={
                                                reserveIncentive.aTokenAddress
                                            }
                                            amount={
                                                getUserBalance(
                                                    index
                                                )?.toString() ?? '0'
                                            }
                                        />
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
