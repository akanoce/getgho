import { useEffect, useMemo } from 'react';
import { useBorrowAsset } from '@/hooks/useBorrowAsset';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ReserveDataHumanized } from '@aave/aave-utilities/packages/contract-helpers';
import {
    FormatReserveUSDResponse,
    FormatUserSummaryAndIncentivesResponse
} from '@aave/aave-utilities/packages/math-utils';
import { BigNumber } from 'bignumber.js';
import { useBorrowAssetOnBehalf } from '@/hooks/useBorrowAssetOnBehalf';

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

    const {
        isSupplyTxLoading,
        mutate: borrow,
        supplyTxResult,
        supplyTxError
    } = useBorrowAsset({
        reserve: reserve.underlyingAsset,
        amount: toBorrow.toString()
    });

    const {
        mutate: borrowOnBehalf,
    } = useBorrowAssetOnBehalf({
        reserve: reserve.underlyingAsset,
        amount: '10', // TODO: ADD MODAL TO SPECIFY AMOUNT
        onBehalfOf: '0x97b465c1869819282e9728E6D9d8Fd56deA8FBee' // TODO: ADD MODAL TO SPECIFY DELERGATOR ADDRESS
    });

    const isLoading = isSupplyTxLoading;

    useEffect(() => {
        console.log({ supplyTxResult, supplyTxError });
    }, [supplyTxError, supplyTxResult]);

    return (
        <Menu>
            <MenuButton
                as={Button}
                colorScheme="orange"
                variant="outline"
                size="sm"
                isDisabled={false}
            >
                Borrow
            </MenuButton>
            <MenuList>
                <MenuItem onClick={() => borrow()}>Borrow</MenuItem>
                <MenuItem
                    onClick={() => borrowOnBehalf()}
                >
                    Borrow with Credit
                </MenuItem>
            </MenuList>
        </Menu>
    );
};
