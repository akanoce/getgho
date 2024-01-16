import { useCounterFactualAddress } from '@repo/lfgho-sdk';
import { ConnectKitButton } from 'connectkit';
import { ChangeEvent, useState } from 'react';
import { parseEther } from 'viem';
import { sepolia, useAccount, useSendTransaction } from 'wagmi';

export const Deposit = () => {
    const { addressRecords } = useCounterFactualAddress();
    const wallet = addressRecords?.[sepolia.id];

    const { isConnected } = useAccount();
    const { sendTransaction } = useSendTransaction();
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };
    return (
        <div className="border-2 border-black rounded-xl p-2">
            <h3>deposit</h3>
            {isConnected
                ? `your wallet fot the deposit is:`
                : 'connect your wallet to make the deposit:'}
            <ConnectKitButton />
            <br />
            {isConnected && (
                <>
                    <input
                        className="border-2 border-black rounded-xl px-2 py-1"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                    <button
                        className="border-2 border-black rounded-xl px-2 py-1 ml-2"
                        disabled={!Number(amount)}
                        onClick={() =>
                            sendTransaction({
                                to: wallet as `0x${string}`,
                                value: parseEther(amount)
                            })
                        }
                    >
                        deposit
                    </button>
                </>
            )}
        </div>
    );
};
