import { useSupplyAsset } from '@/hooks/useSupplyAsset';
import {
    Button,
    FormControl,
    FormHelperText,
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
import { useState } from 'react';
type Props = {
    maxAmount: string;
    reserveAddress: string;
};
export const SupplyUnderlyingAssetButton: React.FC<Props> = ({
    reserveAddress,
    maxAmount
}) => {
    const [amount, setAmount] = useState('0');
    const { isSupplyTxLoading, mutate } = useSupplyAsset({
        reserve: reserveAddress,
        amount
    });

    const isLoading = isSupplyTxLoading;

    const isDisabled =
        !Number(amount) ||
        isLoading ||
        Number(amount) > Number(maxAmount) ||
        Number(amount) <= 0;

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    isDisabled={!maxAmount || maxAmount === '0'}
                >
                    Supply
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
                                    onClick={() => setAmount(maxAmount)}
                                >
                                    Use Max: {maxAmount}
                                </Button>
                            </FormHelperText>
                        </FormControl>
                    </PopoverBody>
                    <PopoverFooter>
                        <Button
                            isDisabled={isDisabled}
                            size="sm"
                            alignSelf={'flex-end'}
                            colorScheme="purple"
                            isLoading={isLoading}
                            onClick={() => mutate()}
                        >
                            Confirm
                        </Button>
                    </PopoverFooter>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
