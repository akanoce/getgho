import { useMutation } from 'wagmi';
import { createBorrowTx } from '@/api';
import { LPBorrowParamsType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { InterestRate } from '@aave/aave-utilities/packages/contract-helpers';
import { useAccountAdapter } from './useAccountAdapter';

type Props = {
    amount: string;
    reserve: string;
    onBehalfOf?: string
};
/**
 * Hook to borrow an asset to a reserve of the AAVE protocol pool
 * Handles the approval of the asset to the AAVE protocol pool
 * Handles the supply of the asset to the AAVE protocol pool
 * @param param0
 * @returns
 */
export const useBorrowAssetOnBehalf = ({ amount, reserve, onBehalfOf }: Props) => {
    const { sendTransaction, account } = useAccountAdapter();

    const { poolContract } = useAaveContracts();

    const supplyAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        const data: LPBorrowParamsType = {
            amount: amount,
            user: account,
            reserve,
            interestRateMode: InterestRate.Variable,
            onBehalfOf
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
