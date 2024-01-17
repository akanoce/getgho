import { PublicClient, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { config } from '@repo/config';

export const getViemPublicClient = (): PublicClient =>
    createPublicClient({
        transport: http(sepolia.rpcUrls.alchemy.http[0], {
            fetchOptions: {
                headers: {
                    Authorization: `Bearer ${config.alchemyApiKey}`
                }
            }
        }),
        chain: sepolia
    });
