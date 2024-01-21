import { submitTransaction } from '@/api';
import { EthereumTransactionTypeExtended } from '@aave/aave-utilities';
import {
    useAuth,
    useCounterFactualAddress,
    useSponsoredTxFlag,
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
    const { isSponsoredTx } = useSponsoredTxFlag();

    const {
        sendAaveBatchTransactions,
        sendSponsoredERC20AaveBatchTransactions
    } = useTransactions();

    const { logout: logoutSmartAccount } = useAuth();
    const { disconnect } = useDisconnect();

    const account = useMemo(
        () => address ?? smartAccountWallet,
        [address, smartAccountWallet]
    );

    const logout = useCallback(() => {
        if (smartAccountWallet) return logoutSmartAccount();
        return disconnect();
    }, [disconnect, logoutSmartAccount, smartAccountWallet]);

    const sendTransaction = async ({
        txs
    }: {
        txs: EthereumTransactionTypeExtended[];
    }): Promise<`0x${string}`> => {
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
            //TODO: we don't need this as the receipt is already awaited in the function above
            return sendTxResult[0];
        } else {
            if (isSponsoredTx) {
                return await sendSponsoredERC20AaveBatchTransactions({ txs });
            } else {
                return await sendAaveBatchTransactions({ txs });
            }
        }
    };

    return { sendTransaction, account, logout };
};
