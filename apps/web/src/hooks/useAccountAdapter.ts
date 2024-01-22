import { submitTransaction } from '@/api';
import { EthereumTransactionTypeExtended } from '@aave/aave-utilities';
import {
    useAuth,
    useCounterFactualAddress,
    useLfghoClients,
    useSponsoredTxFlag,
    useTransactions
} from '@repo/lfgho-sdk';
import { useCallback, useMemo } from 'react';
import {
    sepolia,
    useAccount,
    useDisconnect,
    useNetwork,
    usePublicClient,
    useWalletClient
} from 'wagmi';

export const useAccountAdapter = () => {
    //SCA
    const { addressRecords } = useCounterFactualAddress();
    const smartAccountWallet = addressRecords?.[sepolia.id];
    const { isSponsoredTx } = useSponsoredTxFlag();
    const { logout: logoutSmartAccount } = useAuth();
    const { viemPublicClient } = useLfghoClients();

    const {
        sendAaveBatchTransactions,
        sendSponsoredERC20AaveBatchTransactions
    } = useTransactions();

    //EOA
    const { chain } = useNetwork();
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { disconnect } = useDisconnect();

    const account = useMemo(
        () => address ?? smartAccountWallet,
        [address, smartAccountWallet]
    );

    const connectedChain = useMemo(
        () => chain ?? viemPublicClient.chain,
        [chain, viemPublicClient.chain]
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

    return { sendTransaction, account, logout, chain: connectedChain };
};
