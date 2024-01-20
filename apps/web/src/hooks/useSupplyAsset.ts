import { useMutation } from 'wagmi';
import { createSupplyTxs } from '@/api';
import { LPSignERC20ApprovalType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import dayjs from 'dayjs';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';

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
        await sendTransaction({ txs });
    };

    const {
        data: supplyTxResult,
        isLoading: isSupplyTxLoading,
        error: supplyTxError,
        mutate: supply
    } = useMutation({
        mutationFn: supplyAsset
    });

    return {
        mutate: supply,
        isSupplyTxLoading,
        supplyTxError,
        supplyTxResult
    };
};
