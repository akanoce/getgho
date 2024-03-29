import { useMutation } from 'wagmi';
import { createBorrowTx } from '@/api';
import { LPBorrowParamsType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { InterestRate } from '@aave/aave-utilities';
import { useAccountAdapter } from './useAccountAdapter';
import { useActionWithToastAndRefresh } from './useActionWithToastAndRefresh';

type Props = {
    amount?: string;
    reserve?: string;
};
/**
 * Hook to borrow an asset to a reserve of the AAVE protocol pool
 * Handles the approval of the asset to the AAVE protocol pool
 * Handles the supply of the asset to the AAVE protocol pool
 * @param param0
 * @returns
 */
export const useBorrowAsset = ({ amount, reserve }: Props) => {
    const { sendTransaction, account } = useAccountAdapter();

    const { poolContract } = useAaveContracts();
    const actionWithToastAndRefresh = useActionWithToastAndRefresh();

    const borrowAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        if (!amount) throw new Error('no amount');
        if (!reserve) throw new Error('no reserve ');

        const data: LPBorrowParamsType = {
            amount: amount,
            user: account,
            reserve,
            interestRateMode: InterestRate.Variable
        };
        console.log({ data });
        console.log('Creating borrow tx...');
        const txs = await createBorrowTx(poolContract, {
            ...data
        });
        console.log({ txs });
        console.log('Submitting tx...');

        console.log({ txs });
        console.log('Submitting txs...');
        return await sendTransaction({ txs });
    };

    const withdrawWithToast = async () => {
        await actionWithToastAndRefresh(borrowAsset, {
            success: {
                title: 'Borrow Successful',
                description: (tx) =>
                    `Your assets have been borrow with transaction ${tx}`
            },
            error: {
                title: 'Error Borrowing',
                description: 'Retry later'
            },
            loadingTransactionCreation: {
                title: 'Borrow in progress',
                description: `Creating transaction...`
            },
            loadingReciptConfirmation: {
                title: 'Borrow in progress',
                description: (tx) => `waiting for transaction ${tx}`
            }
        });
    };

    const {
        data: supplyTxResult,
        isLoading: isSupplyTxLoading,
        error: supplyTxError,
        mutate: borrow
    } = useMutation({
        mutationFn: withdrawWithToast
    });

    return {
        mutate: borrow,
        isSupplyTxLoading,
        supplyTxError,
        supplyTxResult
    };
};
