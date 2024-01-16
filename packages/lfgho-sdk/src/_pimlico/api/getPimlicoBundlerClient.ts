import { createPimlicoBundlerClient } from 'permissionless/clients/pimlico';
import { http } from 'viem';
import { config } from '@repo/config';
import { sepolia } from 'viem/chains';
import { PIMLICO_BASE_URL } from '../const';

export const getPimlicoBundlerClient = () => {
    const pimlicoNetwork = sepolia.id;

    const bundlerClient = createPimlicoBundlerClient({
        chain: sepolia,
        transport: http(
            `${PIMLICO_BASE_URL}${pimlicoNetwork}/rpc?apikey=${config.pimlicoApiKey}`
        )
    });

    return bundlerClient;
};
