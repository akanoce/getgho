import { useToast } from '@chakra-ui/react';
import { useRef } from 'react';
import { useQueryClient, usePublicClient } from 'wagmi';

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
