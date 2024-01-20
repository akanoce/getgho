import { useMutation, usePublicClient, useWalletClient } from 'wagmi';
import { createBorrowTx, submitTransaction } from '@/api';
import { LPBorrowParamsType } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { useAaveContracts } from '@/providers';
import { InterestRate } from '@aave/aave-utilities/packages/contract-helpers';

type Props = {
    amount: string;
    reserve: string;
};
/**
 * Hook to borrow an asset to a reserve of the AAVE protocol pool
 * Handles the approval of the asset to the AAVE protocol pool
 * Handles the supply of the asset to the AAVE protocol pool
 * @param param0
 * @returns
 */
export const useBorrowAsset = ({ amount, reserve }: Props) => {
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const { poolContract } = useAaveContracts();

    const supplyAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!walletClient) throw new Error('no walletClient');
        const data: LPBorrowParamsType = {
            amount: amount,
            user: walletClient.account.address as `0x${string}`,
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
        const sendTxResult = await submitTransaction({
            publicClient,
            txs,
            signer: walletClient
        });
        console.log('sendTxResult', sendTxResult);
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
