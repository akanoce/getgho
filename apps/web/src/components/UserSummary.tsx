import { useBalance, useUserReservesIncentives } from '@/api';
import React from 'react';
import { Spinner } from './Spinner';
import { AddressButton, Card } from '.';
import {
    useLfghoClients,
    useTurnkeyViem,
    sendTransactionWithSponsor
} from '@repo/lfgho-sdk';
import { Address } from 'viem';
import { erc20ABI } from 'wagmi';
import { Interface } from 'ethers/lib/utils';

type Props = {
    address: string;
};
export const UserSummary: React.FC<Props> = ({ address }) => {
    const {
        ethersProvider,
        pimlicoBundler,
        pimlicoPaymaster,
        viemPublicClient
    } = useLfghoClients();

    const { getViemInstance } = useTurnkeyViem();

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

    const transferETH = async () => {
        const iface = new Interface(erc20ABI);

        const passkeyAccount = (await getViemInstance()).account;

        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];

        await sendTransactionWithSponsor(
            '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0', //USDT
            iface,
            'transfer',
            ['0x3427034D30c9306F95715C6b14690587584cCEDF', 1000000n],
            0n,
            address as Address,
            pimlicoBundler,
            pimlicoPaymaster,
            viemPublicClient,
            passkeyAccount,
            entryPoint
        );
    };

    return (
        <Card>
            <div className="flex flex-row justify-between">
                <span className="text-2xl font-bold">User Summary (AA)</span>
                <AddressButton address={address} withCopy={true} />
                <button
                    className="border-2 border-black rounded-xl px-2 py-1 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={transferETH}
                >
                    SEND
                </button>
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-xl">ETH Balance</span>
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
