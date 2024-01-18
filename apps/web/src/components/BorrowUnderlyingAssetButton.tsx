import { useEffect } from 'react';
import { Spinner } from './Spinner';
import { useBorrowAsset } from '@/hooks/useBorrowAsset';

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
        <button
            className="border-2 border-black rounded-xl px-2 py-1 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!Number(amount)}
            onClick={() => mutate()}
        >
            {isLoading ? <Spinner /> : 'Borrow'}
        </button>
    );
};
