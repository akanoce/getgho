import { useWallet } from '@repo/passkeys';
import { ConnectKitButton } from 'connectkit';
import { ChangeEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';
import { Card } from '..';
import { Spinner } from '../Spinner';

export const Deposit = () => {
    const { wallet } = useWallet();
    const { isConnected } = useAccount();
    const { sendTransaction, isLoading, error, isSuccess } =
        useSendTransaction();
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleDeposit = () => {
        sendTransaction({
            to: wallet?.address as `0x${string}`,
            value: parseEther(amount)
        });
    };

    if (!isConnected)
        return (
            <Card>
                <span className="text-2xl font-bold">Deposit funds to AA</span>
                Connect your wallet first
                <ConnectKitButton />
            </Card>
        );
    return (
        <Card>
            <div className="flex flex-row justify-between items-center">
                <span className="text-2xl font-bold">Deposit funds to AA</span>
                <ConnectKitButton />
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-700">Amount</label>
                    <input
                        id="amount"
                        className="border-2 border-black rounded-xl px-2 py-1"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>
                <button
                    className="border-2 border-black rounded-xl px-2 py-1 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!Number(amount)}
                    onClick={handleDeposit}
                >
                    {isLoading ? <Spinner /> : 'Deposit '}
                </button>
            </div>
            {error && <span className="text-red-500">{error.message}</span>}
            {isSuccess && (
                <span className="text-green-500">Deposit successful</span>
            )}
        </Card>
    );
};
