import { config } from '@repo/config';
import { http, createWalletClient, LocalAccount, WalletClient } from 'viem';
import { sepolia } from 'viem/chains';

export const createViemSigner = async (
    viemAccount: LocalAccount
): Promise<WalletClient> => {
    //authenticate to alchemy rpc
    const transport = http(`${sepolia.rpcUrls.alchemy.http[0]}`, {
        fetchOptions: {
            headers: {
                Authorization: `Bearer ${config.alchemyApiKey}`
            }
        }
    });

    // Viem Client (https://viem.sh/docs/ethers-migration#signers--accounts)
    const viemClient = createWalletClient({
        account: viemAccount,
        chain: sepolia,
        transport: transport
    });

    return viemClient;
};
