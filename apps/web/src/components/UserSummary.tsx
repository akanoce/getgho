import { useBalance, useUserReservesIncentives } from '@/api';
import React from 'react';
import { Spinner } from './Spinner';
import { Card } from '.';
import { useLfghoClients } from '@repo/lfgho-sdk';

type Props = {
    address: string;
};
export const UserSummary: React.FC<Props> = ({ address }) => {
    const { ethersProvider } = useLfghoClients();

    const { data: balance } = useBalance(ethersProvider, address);
    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedSummary = userReservesIncentives?.formattedUserSummary;

    const humanizeAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!formattedSummary)
        return (
            <Card additionalClasses="justify-center items-center h-52">
                <span className="text-2xl font-bold">User Summary</span>
                <Spinner />
            </Card>
        );

    return (
        <Card>
            <div className="flex flex-row justify-between">
                <span className="text-2xl font-bold">User Summary (AA)</span>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded flex flex-row justify-center items-center">
                    {humanizeAddress(address)}
                </span>
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">Wallet Balance</span>
                <span className="text-xl font-semibold">{balance} ETH</span>
            </div>
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
        </Card>
    );
};
