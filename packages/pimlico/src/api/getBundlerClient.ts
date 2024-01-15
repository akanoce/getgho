import { createPimlicoBundlerClient } from 'permissionless/clients/pimlico';
import { Chain, http } from 'viem';

import { getPimlicoNetworkId } from './getNetworkID';
import { AppConfig } from '@repo/config';

export const getPimlicoBundlerClient = async ({
    chain,
    config
}: {
    chain: Chain;
    config: AppConfig;
}) => {
    const baseUrl = 'https://api.pimlico.io/v1/';
    const pimlicoNetwork = getPimlicoNetworkId(chain);
    const bundlerClient = createPimlicoBundlerClient({
        chain: chain,
        transport: http(
            `${baseUrl}${pimlicoNetwork}/rpc?apikey=${config.pimlicoApiKey}`
        )
    });
    return bundlerClient;
};
