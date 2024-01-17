import { useBalance, useERC20Balance, useUserReservesIncentives } from '@/api';
import React from 'react';
import { Spinner } from './Spinner';
import { AddressButton, Card } from '.';
import { useLfghoClients } from '@repo/lfgho-sdk';
import { ethers } from 'ethers';

type Props = {
    address: string;
};
export const UserSummary: React.FC<Props> = ({ address }) => {
    const { ethersProvider } = useLfghoClients();

    const { data: erc20Balance } = useERC20Balance(address);
    const { data: balance } = useBalance(ethersProvider, address);
    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    const formattedSummary = userReservesIncentives?.formattedUserSummary;

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
                <AddressButton address={address} withCopy={true} />
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">ETH Balance</span>
                <span className="text-xl font-semibold">{balance} ETH</span>
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">USDC Balance</span>
                <span className="text-xl font-semibold">
                    {ethers.utils
                        .formatUnits(erc20Balance ?? '0', 6)
                        .toString()}{' '}
                    USDC
                </span>
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
