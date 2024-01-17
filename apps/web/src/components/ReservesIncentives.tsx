import { useReservesIncentives } from '@/api';
import { Spinner } from './Spinner';
import { erc20ABI, useContractReads } from 'wagmi';
import React from 'react';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';

type Props = {
    address: string;
};
export const ReservesIncentives: React.FC<Props> = ({ address }) => {
    const { data: reservesIncentives } = useReservesIncentives();

    console.log({ reservesIncentives });

    console.log({ address });

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

    // console.log({ result });

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
                                        {formatUnits(result?.data?.[index], 18)}
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
