import { useEffect, useMemo } from 'react';
import { useBorrowAsset } from '@/hooks/useBorrowAsset';
import { Button } from '@chakra-ui/react';
import { ReserveDataHumanized } from '@aave/contract-helpers';
import {
    FormatReserveUSDResponse,
    FormatUserSummaryAndIncentivesResponse
} from '@aave/math-utils';
import { BigNumber } from 'bignumber.js';

type Props = {
    reserve: ReserveDataHumanized & FormatReserveUSDResponse;
    formattedUserSummary?: FormatUserSummaryAndIncentivesResponse<
        ReserveDataHumanized & FormatReserveUSDResponse
    >;
};
export const BorrowUnderlyingAssetButton: React.FC<Props> = ({
    reserve,
    formattedUserSummary
}) => {
    const availableToBorrowUsd = new BigNumber(
        formattedUserSummary?.availableBorrowsUSD ?? 0
    );
    const reservePriceInUsd = new BigNumber(reserve.priceInUSD ?? 0);
    const availableToBorrowInReserve = useMemo(() => {
        if (!availableToBorrowUsd || !reservePriceInUsd) return 0;
        return availableToBorrowUsd.div(reservePriceInUsd);
    }, [availableToBorrowUsd, reservePriceInUsd]);

    const toBorrow = new BigNumber(availableToBorrowInReserve).multipliedBy(
        0.1
    );

    const { isSupplyTxLoading, mutate, supplyTxResult, supplyTxError } =
        useBorrowAsset({
            reserve: reserve.underlyingAsset,
            amount: toBorrow.toString()
        });

    const isLoading = isSupplyTxLoading;

    useEffect(() => {
        console.log({ supplyTxResult, supplyTxError });
    }, [supplyTxError, supplyTxResult]);

    return (
        <Button
            colorScheme="orange"
            variant={'outline'}
            size={'sm'}
            isDisabled={!Number(availableToBorrowInReserve)}
            onClick={() => mutate()}
            isLoading={isLoading}
        >
            Borrow
        </Button>
    );
};
