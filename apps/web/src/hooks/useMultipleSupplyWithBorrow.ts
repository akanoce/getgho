import { useMutation } from 'wagmi';
import { createBorrowTx, createSupplyTxs } from '@/api';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';
import {
    EthereumTransactionTypeExtended,
    InterestRate
} from '@aave/aave-utilities/packages/contract-helpers';
import {
    LPBorrowParamsType,
    LPSupplyParamsType
} from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { ReserveDataHumanized } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-UiPoolDataProvider-contract/types';
import { FormatReserveUSDResponse } from '@aave/aave-utilities/packages/math-utils';
import BigNumber from 'bignumber.js';
import { useActionWithToastAndRefresh } from './useActionWithToastAndRefresh';

type TAmountAndReserve = {
    amountInUsd: number | string;
    reserve?: ReserveDataHumanized & FormatReserveUSDResponse;
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

    const actionWithToastAndRefresh = useActionWithToastAndRefresh();

    const multipleSupplyWithBorrow = async () => {
        if (!poolContract) throw new Error('no poolContract');
        if (!account) throw new Error('no account found');

        console.log({ toSupply, toBorrow });

        const allTxs: EthereumTransactionTypeExtended[] = [];
        let totalEstimatedAvailableUsdToBorrow: number = 0;
        for (const { amount, reserve, amountInUsd } of toSupply) {
            if (!reserve) throw new Error('no reserve');
            const supplyData: LPSupplyParamsType = {
                amount: amount,
                user: account,
                reserve: reserve.underlyingAsset
            };

            console.log({ reserve });

            console.log({
                ...supplyData,
                amountInUsd,
                ltv: reserve.formattedBaseLTVasCollateral
            });
            console.log('Creating supply with permit txs...');
            const supplyTxs = await createSupplyTxs(poolContract, {
                ...supplyData
            });

            totalEstimatedAvailableUsdToBorrow += new BigNumber(amountInUsd)
                .multipliedBy(
                    new BigNumber(reserve.formattedBaseLTVasCollateral)
                )
                .toNumber();

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

        const borrowData: LPBorrowParamsType = {
            amount: maxAmountBorrowable.toString(),
            user: account,
            reserve: toBorrow.underlyingAsset,
            interestRateMode: InterestRate.Variable
        };

        const borrowTxs = await createBorrowTx(poolContract, {
            ...borrowData
        });
        allTxs.push(...borrowTxs);
        console.log('Submitting txs...');
        return await sendTransaction({ txs: allTxs });
    };

    const multipleSupplyWithBorrowWithToast = async () => {
        await actionWithToastAndRefresh(multipleSupplyWithBorrow, {
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
        mutate: supply
    } = useMutation({
        mutationFn: multipleSupplyWithBorrowWithToast
    });

    return {
        mutate: supply,
        isSupplyTxLoading,
        supplyTxError,
        supplyTxResult
    };
};
