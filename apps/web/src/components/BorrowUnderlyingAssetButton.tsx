import { useEffect } from 'react';
import { useBorrowAsset } from '@/hooks/useBorrowAsset';
import { Button } from '@chakra-ui/react';

type Props = {
    amount: string;
    reserve: string;
};
export const BorrowUnderlyingAssetButton: React.FC<Props> = ({
    reserve,
    amount
}) => {
    const { isSupplyTxLoading, mutate, supplyTxResult, supplyTxError } =
        useBorrowAsset({ reserve, amount });

    const isLoading = isSupplyTxLoading;

    useEffect(() => {
        console.log({ supplyTxResult, supplyTxError });
    }, [supplyTxError, supplyTxResult]);

    return (
        <Button
            colorScheme="orange"
            variant={'outline'}
            size={'sm'}
            disabled={!Number(amount)}
            onClick={() => mutate()}
            isLoading={isLoading}
        >
            Borrow
        </Button>
    );
};
