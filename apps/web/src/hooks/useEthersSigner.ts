import { providers } from 'ethers';
import { useMemo } from 'react';
import { WalletClient } from 'wagmi';
import { getWalletClient } from 'wagmi/actions';

export function clientToSigner(client: WalletClient) {
    const { account, chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export async function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const walletClient = await getWalletClient({ chainId });
    return useMemo(
        () => (walletClient ? clientToSigner(walletClient) : undefined),
        [walletClient]
    );
}
