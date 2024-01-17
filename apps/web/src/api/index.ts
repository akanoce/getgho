import { BigNumber } from 'ethers';
import { EthereumTransactionTypeExtended } from '@aave/contract-helpers';
import { WalletClient } from 'viem';

// TODO: wagmi-based method to sign and submit txs
type SubmitTransactionParamsType = {
    signer: WalletClient;
    txs: EthereumTransactionTypeExtended[];
};
export const submitTransaction = async ({
    signer,
    txs // The transaction to be signed
}: SubmitTransactionParamsType) => {
    for (const tx of txs) {
        const extendedTxData = await tx.tx();
        const { from, ...txData } = extendedTxData;
        const txResponse = await signer.sendTransaction({
            ...txData,
            value: txData.value ? BigNumber.from(txData.value) : undefined
        });
        return txResponse;
    }
};

export * from './turnkey';
export * from './aave';
export * from './hooks';
