import { useMutation, usePublicClient, useWalletClient } from 'wagmi';
import { createSupplyTxs, submitTransaction } from '@/api';
import { LPSignERC20ApprovalType } from '@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import dayjs from 'dayjs';
import { useAaveContracts } from '@/providers';

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
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const { poolContract } = useAaveContracts();

    const supplyAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!walletClient) throw new Error('no walletClient');
        const data: LPSignERC20ApprovalType = {
            amount: amount,
            user: walletClient.account.address as `0x${string}`,
            reserve,
            deadline: dayjs().add(1, 'day').unix().toString()
        };
        console.log('Creating supply with permit txs...');
        const txs = await createSupplyTxs(poolContract, {
            ...data
        });
        console.log({ txs });
        console.log('Submitting txs...');
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
