import { useMutation } from 'wagmi';
import { createSupplyTxs, useActionWithToastAndRefresh } from '@/api';
import dayjs from 'dayjs';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';
import { LPSignERC20ApprovalType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';

type Props = {
    amount: string;
    reserve: string;
};
/**
 * Hook to supply an asset to a reserve of the AAVE protocol pool
 * Handles the approval of the asset to the AAVE protocol pool
 * Handles the supply of the asset to the AAVE protocol pool
 * @param param0
 * @returns
 */
export const useSupplyAsset = ({ amount, reserve }: Props) => {
    const { poolContract } = useAaveContracts();
    const { sendTransaction, account } = useAccountAdapter();
    const actionWithToastAndRefresh = useActionWithToastAndRefresh();

    const supplyAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        const data: LPSignERC20ApprovalType = {
            amount: amount,
            user: account,
            reserve,
            deadline: dayjs().add(1, 'day').unix().toString()
        };

        console.log('TX', data);
        console.log('Creating supply with permit txs...');
        const txs = await createSupplyTxs(poolContract, {
            ...data
        });
        console.log('Submitting txs...');
        return sendTransaction({ txs });
    };

    const supplywWithToast = async () => {
        await actionWithToastAndRefresh(supplyAsset, {
            success: {
                title: 'Supply Successful',
                description: (tx) =>
                    `Your assets have been supplied with transaction ${tx}`
            },
            error: {
                title: 'Error Supplying',
                description: 'Retry later'
            },
            loadingTransactionCreation: {
                title: 'Supply in progress',
                description: `Creating transaction...`
            },
            loadingReciptConfirmation: {
                title: 'Supply in progress',
                description: (tx) => `waiting for transaction ${tx}`
            }
        });
    };

    const {
        data: supplyTxResult,
        isLoading: isSupplyTxLoading,
        error: supplyTxError,
        mutate: supply
    } = useMutation({
        mutationFn: supplywWithToast
    });

    return {
        mutate: supply,
        isSupplyTxLoading,
        supplyTxError,
        supplyTxResult
    };
};
