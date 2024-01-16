import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

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
