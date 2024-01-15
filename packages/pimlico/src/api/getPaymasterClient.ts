import { pimlicoPaymasterActions } from 'permissionless/actions/pimlico';
import { Chain, createClient, http } from 'viem';

import { getPimlicoNetworkId } from './getNetworkID';
import { AppConfig } from '@repo/config';

export const getPimlicoPaymasterClient = async ({
    chain,
    config
}: {
    chain: Chain;
    config: AppConfig;
}) => {
    // ⚠️ using v2 of the API ⚠️
    const baseUrl = 'https://api.pimlico.io/v2/';
    const pimlicoNetwork = getPimlicoNetworkId(chain);
    const bundlerClient = createClient({
        chain: chain,
        transport: http(
            `${baseUrl}${pimlicoNetwork}/rpc?apikey=${config.pimlicoApiKey}`
        )
    }).extend(pimlicoPaymasterActions);
    return bundlerClient;
};
