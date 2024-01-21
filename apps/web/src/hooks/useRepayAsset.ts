import { useMutation } from 'wagmi';
import { createRepayTx, createRepayWithATokens } from '@/api';
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
        await sendTransaction({ txs });
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
        await sendTransaction({ txs });
    };

    const mutationFn = (withATokens = true) => {
        if (withATokens) {
            return repayAssetWithATokens();
        }
        return repayAsset();
    };

    return useMutation({
        mutationFn
    });
};
