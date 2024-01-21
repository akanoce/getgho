import { useMutation } from 'wagmi';
import {
    createRepayTx,
    createRepayWithATokens,
    useActionWithToastAndRefresh
} from '@/api';
import {
    LPRepayParamsType,
    LPRepayWithATokensType
} from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';
import { InterestRate } from '@aave/aave-utilities/packages/contract-helpers';

type Props = {
    amount: string;
    reserve: string;
};
/**
 * Hook to repay an asset from a reserve of the AAVE protocol pool
 * @param param0 {amount, reserve} amount is the amount to repay, reserve is the address of the asset to repay
 * @returns {mutate, isLoading, error, data}
 */
export const useRepayAsset = ({ amount, reserve }: Props) => {
    const { sendTransaction, account } = useAccountAdapter();

    const { poolContract } = useAaveContracts();
    const actionWithToastAndRefresh = useActionWithToastAndRefresh();

    const repayAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        const data: LPRepayParamsType = {
            amount: amount,
            user: account,
            reserve,
            interestRateMode: InterestRate.Variable
        };
        console.log({ data });
        console.log('Creating repay txs...');
        const txs = await createRepayTx(poolContract, {
            ...data
        });

        console.log({ txs });
        console.log('Submitting txs...');
        return await sendTransaction({ txs });
    };

    const repayAssetWithATokens = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        const data: LPRepayWithATokensType = {
            amount: amount,
            user: account,
            reserve,
            rateMode: InterestRate.Variable
        };
        console.log({ data });
        console.log('Creating repay wit A txs...');
        const txs = await createRepayWithATokens(poolContract, {
            ...data
        });

        console.log({ txs });
        console.log('Submitting txs...');
        return await sendTransaction({ txs });
    };

    const repayWithToast = async () => {
        await actionWithToastAndRefresh(repayAsset, {
            success: {
                title: 'Repay Successful',
                description: (tx) =>
                    `Your assets have been repay with transaction ${tx}`
            },
            error: {
                title: 'Error Repaying',
                description: 'Retry later'
            },
            loadingTransactionCreation: {
                title: 'Repay in progress',
                description: `Creating transaction...`
            },
            loadingReciptConfirmation: {
                title: 'Repay in progress',
                description: (tx) => `waiting for transaction ${tx}`
            }
        });
    };
    const repayAssetWithATokensWithToast = async () => {
        await actionWithToastAndRefresh(repayAssetWithATokens, {
            success: {
                title: 'Repay Successful',
                description: (tx) =>
                    `Your assets have been repay with transaction ${tx}`
            },
            error: {
                title: 'Error Repaying',
                description: 'Retry later'
            },
            loadingTransactionCreation: {
                title: 'Repay in progress',
                description: `Creating transaction...`
            },
            loadingReciptConfirmation: {
                title: 'Repay in progress',
                description: (tx) => `waiting for transaction ${tx}`
            }
        });
    };

    const mutationFn = (withATokens = true) => {
        if (withATokens) {
            return repayAssetWithATokensWithToast();
        }
        return repayWithToast();
    };

    return useMutation({
        mutationFn
    });
};
