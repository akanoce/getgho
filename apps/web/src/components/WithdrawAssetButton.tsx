import { useWithdrawAsset } from '@/hooks/useWithdrawAsset';
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
export const WithdrawAssetButton: React.FC<Props> = ({
    reserveAddress,
    maxAmount
}) => {
    const [amount, setAmount] = useState('0');
    const { mutate, isLoading } = useWithdrawAsset({
        reserve: reserveAddress,
        amount
    });

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
                    Withdraw
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
