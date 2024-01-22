import { useRepayAsset } from '@/hooks/useRepayAsset';
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
import { useState } from 'react';
type Props = {
    maxAmount: string;
    reserveAddress: string;
};
export const RepayAssetButton: React.FC<Props> = ({
    reserveAddress,
    maxAmount
}) => {
    const [amount, setAmount] = useState('0');
    const { mutate, isLoading } = useRepayAsset({
        reserve: reserveAddress,
        amount
    });

    const isDisabled =
        !Number(amount) ||
        isLoading ||
        Number(amount) <= 0 ||
        Number(amount) > Number(maxAmount);

    //TODO: handle disabled based on balances
    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    isDisabled={!maxAmount || maxAmount === '0'}
                >
                    Repay
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
                        <HStack spacing={2}>
                            <Button
                                isDisabled={isDisabled}
                                size="sm"
                                alignSelf={'flex-end'}
                                colorScheme="purple"
                                isLoading={isLoading}
                                onClick={() => mutate(false)}
                            >
                                Repay
                            </Button>
                            <Button
                                isDisabled={isDisabled}
                                size="sm"
                                alignSelf={'flex-end'}
                                colorScheme="purple"
                                isLoading={isLoading}
                                onClick={() => mutate(true)}
                            >
                                Repay with ATokens
                            </Button>
                        </HStack>
                    </PopoverFooter>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
