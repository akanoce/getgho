import { submitTransaction } from '@/api';
import { EthereumTransactionTypeExtended } from '@aave/aave-utilities/packages/contract-helpers';
import {
    useAuth,
    useCounterFactualAddress,
    useTransactions
} from '@repo/lfgho-sdk';
import { useCallback, useMemo } from 'react';
import {
    sepolia,
    useAccount,
    useDisconnect,
    usePublicClient,
    useWalletClient
} from 'wagmi';

export const useAccountAdapter = () => {
    const { addressRecords } = useCounterFactualAddress();
    const smartAccountWallet = addressRecords?.[sepolia.id];
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { sendAaveBatchTransactions } = useTransactions();

    const { logout: logoutSmartAccount } = useAuth();

    const { disconnect } = useDisconnect();

    const account = useMemo(
        () => address ?? smartAccountWallet,
        [address, smartAccountWallet]
    );

    const logout = useCallback(() => {
        if (smartAccountWallet) return logoutSmartAccount();
        return disconnect();
    }, [logoutSmartAccount]);

    const sendTransaction = async ({
        txs
    }: {
        txs: EthereumTransactionTypeExtended[];
    }) => {
        if (smartAccountWallet && address)
            throw new Error('Cannot have EOA and SCA both connected');

        if (address) {
            if (!walletClient) throw new Error('No wallet client found!');

            const sendTxResult = await submitTransaction({
                publicClient,
                txs,
                signer: walletClient
            });

            console.log('sendTxResult', sendTxResult);
        } else {
            await sendAaveBatchTransactions({ txs });
        }
    };

    return { sendTransaction, account, logout };
};
