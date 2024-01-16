import { useUserReservesIncentives } from '@/api';
import React from 'react';
import { Spinner } from './Spinner';

type Props = {
    address: string;
};
export const UserSummary: React.FC<Props> = ({ address }) => {
    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedSummary = userReservesIncentives?.formattedUserSummary;

    if (!formattedSummary)
        return (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 flex flex-col justify-center items-center gap-y-2 h-52">
                <span className="text-2xl font-bold">User Summary</span>
                <Spinner />
            </div>
        );

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100  flex flex-col gap-y-2">
            <span className="text-2xl font-bold">User Summary</span>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">Available to Borrow</span>
                <span className="text-xl font-semibold">
                    {formattedSummary.availableBorrowsUSD} USD
                </span>
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">Net Worth</span>
                <span className="text-xl font-semibold">
                    {formattedSummary.netWorthUSD} USD
                </span>
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">Total Borrows</span>
                <span className="text-xl font-semibold">
                    {formattedSummary.totalBorrowsUSD} USD
                </span>
            </div>

            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">Total Liquidity</span>
                <span className="text-xl font-semibold">
                    {formattedSummary.totalLiquidityUSD} USD
                </span>
            </div>

            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">Total Collateral</span>
                <span className="text-xl font-semibold">
                    {formattedSummary.totalCollateralUSD} USD
                </span>
            </div>
        </div>
    );
};
