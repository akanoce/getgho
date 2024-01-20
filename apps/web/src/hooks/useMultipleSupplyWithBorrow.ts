import { useMutation } from 'wagmi';
import { createBorrowTx, createSupplyTxs } from '@/api';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';
import {
    EthereumTransactionTypeExtended,
    InterestRate
} from '@aave/aave-utilities/packages/contract-helpers';
import {
    LPSupplyParamsType,
    LPBorrowParamsType
} from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { ReserveDataHumanized } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-UiPoolDataProvider-contract/types';
import { FormatReserveUSDResponse } from '@aave/aave-utilities/packages/math-utils';
import BigNumber from 'bignumber.js';

type TAmountAndReserve = {
    amountInUsd: number | string;
    reserve: ReserveDataHumanized & FormatReserveUSDResponse;
    amount: string;
};

type Props = {
    toSupply: TAmountAndReserve[];
    toBorrow?: ReserveDataHumanized & FormatReserveUSDResponse;
};

/**
 * Hook to supply multiple assets to a reserve of the AAVE protocol pool and borrow an asset from the AAVE protocol pool
 */
export const useMultipleSupplyWithBorrow = ({ toSupply, toBorrow }: Props) => {
    const { poolContract } = useAaveContracts();
    const { sendTransaction, account } = useAccountAdapter();

    const supplyAsset = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        console.log({ toSupply, toBorrow });

        const allTxs: EthereumTransactionTypeExtended[] = [];
        let totalEstimatedAvailableUsdToBorrow: number = 0;
        for (const { amount, reserve, amountInUsd } of toSupply) {
            const supplyData: LPSupplyParamsType = {
                amount: amount,
                user: account,
                reserve: reserve.underlyingAsset
            };

            console.log('TX', supplyData);
            console.log('Creating supply with permit txs...');
            const supplyTxs = await createSupplyTxs(poolContract, {
                ...supplyData
            });

            totalEstimatedAvailableUsdToBorrow +=
                BigNumber(amountInUsd).toNumber();

            allTxs.push(...supplyTxs);
        }

        if (!toBorrow) throw new Error('no toBorrow');
        const maxAmountBorrowable = BigNumber(
            toBorrow.borrowUsageRatio
        ).multipliedBy(totalEstimatedAvailableUsdToBorrow);

        console.log({
            totalEstimatedAvailableUsdToBorrow,
            maxAmountBorrowable
        });

        // const borrowData: LPBorrowParamsType = {
        //     amount: maxAmountBorrowable.toString(),
        //     user: account,
        //     reserve: toBorrow.underlyingAsset,
        //     interestRateMode: InterestRate.Variable
        // };

        // const borrowTxs = await createBorrowTx(poolContract, {
        //     ...borrowData
        // });
        // allTxs.push(...borrowTxs);
        console.log('Submitting txs...');
        await sendTransaction({ txs: allTxs });
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
