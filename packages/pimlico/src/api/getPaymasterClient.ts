import { pimlicoPaymasterActions } from 'permissionless/actions/pimlico';
import { Chain, createClient, http } from 'viem';

import { getPimlicoNetworkId } from './getNetworkID';

export const getPimlicoPaymasterClient = async (chain: Chain) => {
    // ⚠️ using v2 of the API ⚠️
    const baseUrl = 'https://api.pimlico.io/v2/';
    const pimlicoNetwork = getPimlicoNetworkId(chain);
    const bundlerClient = createClient({
        chain: chain,
        transport: http(
            `${baseUrl}${pimlicoNetwork}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}` // TODO - use from func param
        )
    }).extend(pimlicoPaymasterActions);
    return bundlerClient;
};
