import { useSupplyAsset } from '@/hooks/useSupplyAsset';
import { Button } from '@chakra-ui/react';
type Props = {
    amount: string;
    reserveAddress: string;
};
export const SupplyUnderlyingAssetButton: React.FC<Props> = ({
    reserveAddress,
    amount
}) => {
    const { isSupplyTxLoading, mutate } = useSupplyAsset({
        reserve: reserveAddress,
        amount
    });

    const isLoading = isSupplyTxLoading;

    return (
        <Button
            size={'sm'}
            colorScheme="green"
            variant={'outline'}
            isDisabled={!Number(amount)}
            onClick={() => mutate()}
            isLoading={isLoading}
        >
            Supply
        </Button>
    );
};
