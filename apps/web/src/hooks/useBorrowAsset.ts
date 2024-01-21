import { useMutation } from 'wagmi';
import { createBorrowTx } from '@/api';
import { LPBorrowParamsType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { InterestRate } from '@aave/aave-utilities';
import { useAccountAdapter } from './useAccountAdapter';

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
        await sendTransaction({ txs });
    };

    const {
        data: supplyTxResult,
        isLoading: isSupplyTxLoading,
        error: supplyTxError,
        mutate: borrow
    } = useMutation({
        mutationFn: borrowAsset
    });

    return {
        mutate: borrow,
        isSupplyTxLoading,
        supplyTxError,
        supplyTxResult
    };
};
