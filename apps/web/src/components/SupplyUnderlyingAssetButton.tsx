import { useEffect } from 'react';

import { useSupplyAsset } from '@/hooks/useSupplyAsset';
import { Button } from '@chakra-ui/react';
type Props = {
    amount: string;
    reserve: string;
};
export const SupplyUnderlyingAssetButton: React.FC<Props> = ({
    reserve,
    amount
}) => {
    const { isSupplyTxLoading, mutate, supplyTxResult, supplyTxError } =
        useSupplyAsset({ reserve, amount });

    const isLoading = isSupplyTxLoading;

    useEffect(() => {
        console.log({ supplyTxResult, supplyTxError });
    }, [supplyTxError, supplyTxResult]);

    return (
        <Button
            size={'sm'}
            colorScheme="green"
            variant={'outline'}
            disabled={!Number(amount)}
            onClick={() => mutate()}
            isLoading={isLoading}
        >
            Supply
        </Button>
    );
};
