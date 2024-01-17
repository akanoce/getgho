import { pimlicoPaymasterActions } from 'permissionless/actions/pimlico';
import { createClient, http } from 'viem';
import { config } from '@repo/config';
import { sepolia } from 'viem/chains';
import { PIMLICO_BASE_URL_V2 } from '../const';
import { PimlicoPaymasterClient } from 'permissionless/clients/pimlico';

export const getPimlicoPaymasterClient = () => {
    const pimlicoNetwork = sepolia.network;

    const paymasterClient = createClient({
        chain: sepolia,
        transport: http(
            `${PIMLICO_BASE_URL_V2}${pimlicoNetwork}/rpc?apikey=${config.pimlicoApiKey}`
        )
    }).extend(pimlicoPaymasterActions);

    return paymasterClient as PimlicoPaymasterClient;
};
