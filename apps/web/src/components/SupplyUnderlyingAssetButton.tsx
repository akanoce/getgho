import { createSupplyTxs, submitTransaction } from '@/api';

import { useLfghoClients, useTurnkeyViem } from '@repo/lfgho-sdk';
import { parseEther } from 'viem';
import { useMutation } from 'wagmi';
import { Spinner } from './Spinner';
import { useEffect } from 'react';

type Props = {
    amount: string;
    reserve: string;
};
export const SupplyUnderlyingAssetButton: React.FC<Props> = ({
    reserve,
    amount
}) => {
    const { ethersProvider } = useLfghoClients();
    //TODO: we don't want to use EOA
    const { getViemInstance } = useTurnkeyViem();

    const onClick = async () => {
        if (!ethersProvider) throw new Error('no ethersProvider');
        const viemInstance = await getViemInstance();
        if (!viemInstance.signer) throw new Error('no viemInstance.signer');
        const txs = await createSupplyTxs(ethersProvider, {
            amount: parseEther(amount).toString(),
            user: viemInstance.account?.address as `0x${string}`,
            reserve
        });
        const sendTxResult = await submitTransaction({
            txs,
            signer: viemInstance.signer
        });
        console.log('sendTxResult', sendTxResult);
    };

    const { data, isLoading, error, mutate } = useMutation({
        mutationFn: onClick
    });

    useEffect(() => {
        console.log({ error, data });
    }, [error, data]);

    return (
        <button
            className="border-2 border-black rounded-xl px-2 py-1 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!Number(amount)}
            onClick={() => mutate()}
        >
            {isLoading ? <Spinner /> : 'Supply'}
        </button>
    );
};
