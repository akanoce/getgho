import { BigNumber, providers } from 'ethers';
import {
    Pool,
    InterestRate,
    EthereumTransactionTypeExtended,
    BaseDebtToken,
    ERC20Service
} from '@aave/contract-helpers';

// TODO: wagmi-based method to sign and submit txs
// type SubmitTransactionParamsType = {
//   provider: providers.Provider;
//   tx: EthereumTransactionTypeExtended;
// };
// export const submitTransaction = async ({
//   provider, // Signing transactions requires a wallet provider
//   tx, // The transaction to be signed
// }: SubmitTransactionParamsType) => {
//   const extendedTxData = await tx.tx();
//   const { from, ...txData } = extendedTxData;
//   const signer = provider.getSigner(from);
//   const txResponse = await signer.sendTransaction({
//     ...txData,
//     value: txData.value ? BigNumber.from(txData.value) : undefined,
//   });
//   return txResponse;
// };

export * from './turnkey';
export * from './aave';
