import { Address } from 'viem';
import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Switch,
    VStack
} from '@chakra-ui/react';
import { SuppliedAssets } from '@/components/SuppliedAssets';
import { useSponsoredTxFlag } from '@repo/lfgho-sdk';
import { ChangeEvent, useCallback } from 'react';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';
import { ReservesIncentives } from '@/components/ReservesIncentives';
import { UserSummary } from '@/components/UserSummary';
import { AddressButton } from '@/components';
import { BorrowedAssets } from '@/components/BorrowedAssets';

type Props = {
    wallet: Address;
};

export const Home = ({ wallet }: Props) => {
    const { setIsSPonsored } = useSponsoredTxFlag();
    const { logout } = useAccountAdapter();

    const handleOnChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setIsSPonsored(event.target.checked);
        },
        [setIsSPonsored]
    );

    return (
        <VStack spacing={4} alignItems={'stretch'} w="full">
            <HStack
                justifyContent="space-between"
                w="full"
                // pos={'sticky'}
                // top={4}
                // right={4}
                // zIndex={1}
            >
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="sponsored" mb="0">
                        Enable ERC20 Sponsored Transactions
                    </FormLabel>
                    <Switch
                        id="sponsored"
                        size="lg"
                        onChange={handleOnChange}
                    />
                </FormControl>
                <HStack spacing={4}>
                    <AddressButton address={wallet} withCopy={true} />
                    <Button
                        variant={'solid'}
                        colorScheme="purple"
                        onClick={logout}
                        size="sm"
                    >
                        Logout
                    </Button>
                </HStack>
            </HStack>
            <SuppliedAssets address={wallet} />
            <BorrowedAssets address={wallet} />
            <ReservesIncentives address={wallet} />
            <UserSummary address={wallet} />
        </VStack>
    );
};
