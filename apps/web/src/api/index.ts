import { BigNumber } from 'ethers';
import { EthereumTransactionTypeExtended } from '@aave/aave-utilities';
import { WalletClient } from 'viem';
import { PublicClient } from 'wagmi';

// TODO: wagmi-based method to sign and submit txs
type SubmitTransactionParamsType = {
    publicClient: PublicClient;
    signer: WalletClient;
    txs: EthereumTransactionTypeExtended[];
};
export const submitTransaction = async ({
    publicClient,
    signer,
    txs // The transaction to be signed
}: SubmitTransactionParamsType) => {
    const txResponses: `0x${string}`[] = [];
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

        console.log('Waiting for tx receipt...', txResponse);

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: txResponse
        });
        console.log('Got tx receipt', receipt);

        txResponses.push(txResponse);
    }
    return txResponses;
};

export * from './turnkey';
export * from './aave';
export * from './hooks';
