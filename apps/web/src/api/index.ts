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
    console.log({ signer });
    for (const tx of txs) {
        const txGas = await tx.gas();
        console.log('txGas', txGas);
        const extendedTxData = await tx.tx();
        const txData = extendedTxData;
        const txResponse = await signer.sendTransaction({
            ...txData,
            value: BigNumber.from(txData.value).toBigInt()
        });
        return txResponse;
    }
};

export * from './turnkey';
export * from './aave';
export * from './hooks';
