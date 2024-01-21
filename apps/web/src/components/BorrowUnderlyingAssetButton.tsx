import { useEffect, useMemo, useState } from 'react';
import { useBorrowAsset } from '@/hooks/useBorrowAsset';
import {
    Button,
    FormControl,
    FormHelperText,
    HStack,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal
} from '@chakra-ui/react';
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

    const [amount, setAmount] = useState('0');

    const {
        isSupplyTxLoading,
        mutate: borrow,
        supplyTxResult,
        supplyTxError
    } = useBorrowAsset({
        reserve: reserve.underlyingAsset,
        amount: amount.toString()
    });

    const { mutate: borrowOnBehalf } = useBorrowAssetOnBehalf({
        reserve: reserve.underlyingAsset,
        amount: '10', // TODO: ADD MODAL TO SPECIFY AMOUNT
        onBehalfOf: '0x97b465c1869819282e9728E6D9d8Fd56deA8FBee' // TODO: ADD MODAL TO SPECIFY DELERGATOR ADDRESS
    });

    const isLoading = isSupplyTxLoading;

    useEffect(() => {
        console.log({ supplyTxResult, supplyTxError });
    }, [supplyTxError, supplyTxResult]);

    const isDisabled =
        !Number(amount) ||
        isLoading ||
        Number(amount) > Number(availableToBorrowInReserve) ||
        Number(amount) <= 0;

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    colorScheme="orange"
                    variant="outline"
                    size="sm"
                    isDisabled={
                        !availableToBorrowInReserve ||
                        availableToBorrowInReserve.isZero()
                    }
                >
                    Borrow
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Amount</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        <FormControl id="amount">
                            <Input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <FormHelperText>
                                <Button
                                    variant="link"
                                    onClick={() =>
                                        setAmount(
                                            availableToBorrowInReserve.toString()
                                        )
                                    }
                                >
                                    Use Max: =~
                                    {availableToBorrowInReserve.toFixed(2)}
                                </Button>
                            </FormHelperText>
                        </FormControl>
                    </PopoverBody>
                    <PopoverFooter>
                        <HStack spacing={4}>
                            <Button
                                isDisabled={isDisabled}
                                size="sm"
                                alignSelf={'flex-end'}
                                colorScheme="purple"
                                isLoading={isLoading}
                                onClick={() => borrow()}
                            >
                                Borrow
                            </Button>
                            <Button
                                variant="outline"
                                isDisabled={isDisabled}
                                size="sm"
                                alignSelf={'flex-end'}
                                colorScheme="purple"
                                isLoading={isLoading}
                                onClick={() => borrowOnBehalf()}
                            >
                                Borrow with credit
                            </Button>
                        </HStack>
                    </PopoverFooter>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
