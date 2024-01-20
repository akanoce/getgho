import { useMutation } from 'wagmi';
import { createWithdrawTx } from '@/api';
import { LPWithdrawParamsType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';

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
        await sendTransaction({ txs });
    };

    const {
        data,
        isLoading,
        error,
        mutate: withdraw
    } = useMutation({
        mutationFn: withdrawAsset
    });

    return {
        mutate: withdraw,
        isLoading,
        error,
        data
    };
};
