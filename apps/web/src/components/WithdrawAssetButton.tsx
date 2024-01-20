import { useWithdrawAsset } from '@/hooks/useWithdrawAsset';
import { Button } from '@chakra-ui/react';
type Props = {
    amount: string;
    reserveAddress: string;
};
export const WithdrawAssetButton: React.FC<Props> = ({
    reserveAddress,
    amount
}) => {
    const { mutate, isLoading } = useWithdrawAsset({
        reserve: reserveAddress,
        amount
    });

    return (
        <Button
            size={'sm'}
            colorScheme="green"
            variant={'outline'}
            isDisabled={!Number(amount)}
            onClick={() => mutate()}
            isLoading={isLoading}
        >
            Withdraw
        </Button>
    );
};
