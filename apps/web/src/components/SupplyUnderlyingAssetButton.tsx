import { useSupplyAsset } from '@/hooks/useSupplyAsset';
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
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

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    as={Button}
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    isDisabled={false}
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
                    <PopoverFooter>This is the footer</PopoverFooter>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};
