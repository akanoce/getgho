import { http, createWalletClient, LocalAccount, WalletClient } from 'viem';
import { sepolia } from 'viem/chains';
import { TPasskeysConfig } from '../../model';

export const createViemSigner = async ({
    config,
    viemAccount
}: {
    config: TPasskeysConfig;
    viemAccount: LocalAccount;
}): Promise<WalletClient> => {
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
