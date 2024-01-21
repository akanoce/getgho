import { useMutation } from 'wagmi';
import { createApproveDelegationTx } from '@/api';
import { useAccountAdapter } from './useAccountAdapter';
import { useLfghoClients } from '@repo/lfgho-sdk';

type Props = {
    delegatee: string;
    debtTokenAddress: string;
    amount: string;
};
/**
 * Hook to borrow an asset to a reserve of the AAVE protocol pool
 * Handles the approval of the asset to the AAVE protocol pool
 * Handles the supply of the asset to the AAVE protocol pool
 * @param param0
 * @returns
 */
export const useApproveDelegation = ({
    delegatee,
    debtTokenAddress,
    amount
}: Props) => {
    const { sendTransaction, account } = useAccountAdapter();

    const { ethersProvider } = useLfghoClients();

    const approveDelegation = async () => {
        if (!account) throw new Error('no account found');

        const data = {
            user: account,
            delegatee,
            debtTokenAddress,
            amount
        };
        console.log({ data });
        console.log('Creating approve delegation tx...');
        const txs = await createApproveDelegationTx(ethersProvider, {
            ...data
        });
        console.log({ txs });
        console.log('Submitting tx...');

        console.log({ txs });
        console.log('Submitting txs...');
        await sendTransaction({ txs: [txs] });
    };

    const {
        data: supplyTxResult,
        isLoading: isSupplyTxLoading,
        error: supplyTxError,
        mutate: supply
    } = useMutation({
        mutationFn: approveDelegation
    });

    return {
        mutate: supply,
        isSupplyTxLoading,
        supplyTxError,
        supplyTxResult
    };
};
