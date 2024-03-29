import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import {
    USDC_SEPOLIA_ADDRESS,
    useCounterFactualAddress,
    useLfghoClients
} from '@repo/lfgho-sdk';
import { Address } from 'viem';

/**
 * Get the balance of an address from a provider
 * @param provider The provider to use
 * @param address The address to get the balance of
 * @returns The balance of the address
 */
export const useBalance = (
    provider?: ethers.providers.Provider,
    address?: string
) => {
    return useQuery({
        queryKey: ['balance', address],
        queryFn: async () => {
            const balance = await provider?.getBalance(address ?? '');
            const formatted = ethers.utils.formatEther(balance ?? 0);
            return formatted;
        },
        enabled: !!provider && !!address
    });
};

export const useERC20Balance = (tokenAddress?: Address) => {
    const { viemPublicClient } = useLfghoClients();
    const { addressRecords } = useCounterFactualAddress();
    const sender = addressRecords?.[0] as Address;

    return useQuery({
        queryKey: ['erc20Balance', tokenAddress],
        queryFn: async () => {
            const senderUsdcBalance = await viemPublicClient.readContract({
                abi: [
                    {
                        inputs: [{ name: '_owner', type: 'address' }],
                        name: 'balanceOf',
                        outputs: [{ name: 'balance', type: 'uint256' }],
                        type: 'function',
                        stateMutability: 'view'
                    }
                ],
                address: tokenAddress ?? USDC_SEPOLIA_ADDRESS,
                functionName: 'balanceOf',
                args: [sender]
            });

            return senderUsdcBalance;
        },
        enabled: !!sender
    });
};
