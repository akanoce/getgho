import { useMutation } from 'wagmi';
import { createWithdrawTx } from '@/api';
import { LPWithdrawParamsType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';
import { useActionWithToastAndRefresh } from './useActionWithToastAndRefresh';

type Props = {
    amount: string;
    reserve: string;
};
/**
 * Hook to withdraw an asset from a reserve of the AAVE protocol pool
 *
 * Handles the approval of the asset to the AAVE protocol pool
 * Handles the supply of the asset to the AAVE protocol pool
 * @param param0
 * @returns
 */
export const useWithdrawAsset = ({ amount, reserve }: Props) => {
    const { sendTransaction, account } = useAccountAdapter();

    const { poolContract } = useAaveContracts();
    const actionWithToastAndRefresh = useActionWithToastAndRefresh();

    const withdrawAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        const data: LPWithdrawParamsType = {
            amount: amount,
            user: account,
            reserve
        };
        console.log({ data });
        console.log('Creating withdraw txs...');
        const txs = await createWithdrawTx(poolContract, {
            ...data
        });

        console.log({ txs });
        console.log('Submitting txs...');
        return await sendTransaction({ txs });
    };

    const withdrawWithToast = async () => {
        await actionWithToastAndRefresh(withdrawAsset, {
            success: {
                title: 'Withdraw Successful',
                description: (tx) =>
                    `Your assets have been withdrawn with transaction ${tx}`
            },
            error: {
                title: 'Error Withdrawing',
                description: 'Retry later'
            },
            loadingTransactionCreation: {
                title: 'Withdraw in progress',
                description: `Creating transaction...`
            },
            loadingReciptConfirmation: {
                title: 'Withdraw in progress',
                description: (tx) => `waiting for transaction ${tx}`
            }
        });
    };

    const {
        data,
        isLoading,
        error,
        mutate: withdraw
    } = useMutation({
        mutationFn: withdrawWithToast
    });

    return {
        mutate: withdraw,
        isLoading,
        error,
        data
    };
};
