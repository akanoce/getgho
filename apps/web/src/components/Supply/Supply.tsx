import { EthereumTransactionTypeExtended, Pool } from '@aave/contract-helpers';
import { AaveV3Sepolia } from '@bgd-labs/aave-address-book';
import { useWallet } from '@repo/passkeys';
import { BigNumber, providers } from 'ethers';
import { ChangeEvent, useState } from 'react';
import { Chain, WalletClient, parseEther } from 'viem';

export const Supply = ({
    ethersProvider,
    signer
}: {
    ethersProvider: providers.Provider;
    signer?: WalletClient;
}) => {
    const { wallet } = useWallet();
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleSupply = async () => {
        const pool = new Pool(ethersProvider, {
            POOL: AaveV3Sepolia.POOL,
            WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY
        });
        console.log('amount', parseEther(amount));
        const transactions: EthereumTransactionTypeExtended[] =
            await pool.supply({
                user: wallet?.address as `0x${string}`,
                reserve:
                    '0xc558dbdd856501fcd9aaf1e62eae57a9f0629a3c' as `0x${string}`,
                amount: String(parseEther(amount))
            });
        console.log('transactions', transactions);
        for (const tx of transactions) {
            const txGas = await tx.gas();
            console.log('txGas', txGas);
            const txData = await tx.tx();
            console.log('txData', txData);
            const signer = ethersProvider.getSigner();
            console.log('signer', signer);
            const txResponse = await signer?.sendTransaction({
                ...txData,
                value: txData.value ? BigNumber.from(txData.value) : undefined
            });
            console.log('txResponse', txResponse);
        }
    };
    return (
        <div className="border-2 border-black rounded-xl p-2">
            <h3>supply</h3>
            <input
                className="border-2 border-black rounded-xl px-2 py-1"
                type="number"
                value={amount}
                onChange={handleAmountChange}
            />
            <button
                className="border-2 border-black rounded-xl px-2 py-1 ml-2"
                disabled={!Number(amount)}
                onClick={handleSupply}
            >
                supply
            </button>
        </div>
    );
};
