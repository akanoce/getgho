import { useMutation } from 'wagmi';
import { createSupplyTxs } from '@/api';
import { useAaveContracts } from '@/providers';
import { useAccountAdapter } from './useAccountAdapter';
import { EthereumTransactionTypeExtended } from '@aave/aave-utilities/packages/contract-helpers';
import {
    LPSupplyParamsType,
    LPBorrowParamsType
} from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';
import { InterestRate } from '@aave/aave-utilities/packages/contract-helpers';
import { ReserveDataHumanized } from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-UiPoolDataProvider-contract/types';
import { FormatReserveUSDResponse } from '@aave/aave-utilities/packages/math-utils';
import BigNumber from 'bignumber.js';

type TAmountAndReserve = {
    amount: string;
    reserve: ReserveDataHumanized & FormatReserveUSDResponse;
};

type Props = {
    toSupply: TAmountAndReserve[];
    toBorrow: ReserveDataHumanized & FormatReserveUSDResponse;
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

        const allTxs: EthereumTransactionTypeExtended[] = [];
        let totalEstimatedAvailableUsdToBorrow: number = 0;
        for (const { amount, reserve } of toSupply) {
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

            totalEstimatedAvailableUsdToBorrow += BigNumber(amount)
                .times(reserve.priceInMarketReferenceCurrency)
                .toNumber();

            allTxs.push(...supplyTxs);
        }

        const maxAmountBorrowable = BigNumber(
            toBorrow.formattedBaseLTVasCollateral
        ).multipliedBy(totalEstimatedAvailableUsdToBorrow);

        console.log({
            totalEstimatedAvailableUsdToBorrow,
            maxAmountBorrowable,
            ltv: toBorrow.formattedBaseLTVasCollateral
        });

        const borrowData: LPBorrowParamsType = {
            amount: maxAmountBorrowable.toString(),
            user: account,
            reserve: toBorrow.underlyingAsset,
            interestRateMode: InterestRate.Variable
        };

        const borrowTxs = await createSupplyTxs(poolContract, {
            ...borrowData
        });
        allTxs.push(...borrowTxs);
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
