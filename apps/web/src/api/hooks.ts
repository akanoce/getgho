import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import {
    USDC_SEPOLIA_ADDRESS,
    useCounterFactualAddress,
    useLfghoClients
} from '@repo/lfgho-sdk';
import { Address } from 'viem';
import { useToast } from '@chakra-ui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { usePublicClient } from 'wagmi';

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

export const useActionWithToastAndRefresh = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const toastLoading1Ref = useRef<string | number>();
    const toastLoading2Ref = useRef<string | number>();
    const publicClient = usePublicClient();
    const actionWithToastAndRefresh = async (
        callback: () => Promise<`0x${string}` | undefined>,
        toasts: {
            success: {
                title: string | ((s: string) => string);
                description: string | ((s: string) => string);
            };
            error: {
                title: string;
                description: string;
            };
            loadingTransactionCreation: {
                title: string;
                description: string;
            };
            loadingReciptConfirmation: {
                title: string | ((s: string) => string);
                description: string | ((s: string) => string);
            };
        }
    ) => {
        try {
            toastLoading1Ref.current = toast({
                position: 'bottom-left',
                title: toasts.loadingTransactionCreation.title,
                description: toasts.loadingTransactionCreation.description,
                status: 'warning',
                duration: null
            });
            const transaction = await callback();
            toast.close(toastLoading1Ref.current);
            toastLoading2Ref.current = toast({
                position: 'bottom-left',
                title:
                    typeof toasts.loadingReciptConfirmation.title === 'function'
                        ? toasts.loadingReciptConfirmation.title(transaction!)
                        : toasts.loadingReciptConfirmation.title,
                description:
                    typeof toasts.loadingReciptConfirmation.description ===
                    'function'
                        ? toasts.loadingReciptConfirmation.description(
                              transaction!
                          )
                        : toasts.loadingReciptConfirmation.description,
                status: 'warning',
                duration: null
            });
            if (transaction) {
                await publicClient.waitForTransactionReceipt({
                    hash: transaction
                });
            }
            toast.close(toastLoading2Ref.current);
            toast({
                position: 'bottom-left',
                title:
                    typeof toasts.success.title === 'function'
                        ? toasts.success.title(transaction!)
                        : toasts.success.title,
                description:
                    typeof toasts.success.description === 'function'
                        ? toasts.success.description(transaction!)
                        : toasts.success.description,
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch (e) {
            toastLoading1Ref.current && toast.close(toastLoading1Ref.current);
            toastLoading2Ref.current && toast.close(toastLoading2Ref.current);
            toast({
                position: 'bottom-left',
                title: toasts.error.title,
                description: toasts.error.description,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }

        queryClient.refetchQueries();
    };
    return actionWithToastAndRefresh;
};
