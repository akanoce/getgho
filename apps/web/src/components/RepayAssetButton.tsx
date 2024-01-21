import { useRepayAsset } from '@/hooks/useRepayAsset';
import { Button, HStack } from '@chakra-ui/react';
type Props = {
    amount: string;
    reserveAddress: string;
};
export const RepayAssetButton: React.FC<Props> = ({
    reserveAddress,
    amount
}) => {
    const { mutate, isLoading } = useRepayAsset({
        reserve: reserveAddress,
        amount
    });

    //TODO: handle disabled based on balances
    return (
        <HStack gap={2}>
            <Button
                size={'sm'}
                colorScheme="green"
                variant={'solid'}
                isDisabled={!Number(amount)}
                onClick={() => mutate(true)}
                isLoading={isLoading}
            >
                Repay with ATokens
            </Button>
            <Button
                size={'sm'}
                colorScheme="green"
                variant={'outline'}
                isDisabled={!Number(amount)}
                onClick={() => mutate(false)}
                isLoading={isLoading}
            >
                Repay
            </Button>
        </HStack>
    );
};
