import { ChangeEvent, useState } from 'react';
import { Card } from '.';
import { useSponsoredTransaction } from '@repo/lfgho-sdk';
import { Address } from 'viem';

export const SendSponsoredTx = () => {
    const [amount, setAmount] = useState('0');
    const [addressTo, setAddressTo] = useState('');

    const { sponsoredTransaction } = useSponsoredTransaction({
        callData: '0x',
        sponsorTx: false
    });

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddressTo(e.target.value);
    };

    const handleSend = () => {
        const amountToBigInt = BigInt(Number(amount) * 1e6);
        sponsoredTransaction({
            to: addressTo as Address,
            value: amountToBigInt
        });
    };

    return (
        <Card>
            <div className="flex flex-row justify-between items-center">
                <span className="text-2xl font-bold">Send Sponsored USDC</span>
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700">
                            Amount in USDC
                        </label>
                        <input
                            id="amount"
                            className="border-2 border-black rounded-xl px-2 py-1"
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </div>

                    <div className="flex flex-col mx-20">
                        <label className="text-sm text-gray-700">
                            Address to Send
                        </label>
                        <input
                            id="address"
                            className="border-2 border-black rounded-xl px-2 py-1"
                            value={addressTo}
                            onChange={handleAddressChange}
                        />
                    </div>
                </div>

                <button
                    className="border-2 border-black rounded-xl px-2 py-1 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!Number(amount) || !addressTo}
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </Card>
    );
};
