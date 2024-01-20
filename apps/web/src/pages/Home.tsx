import { Address } from 'viem';
import {
    Button,
    FormControl,
    FormLabel,
    Switch,
    VStack
} from '@chakra-ui/react';
import { UserAssets } from '@/components/UserAssets';
import { useSponsoredTxFlag } from '@repo/lfgho-sdk';
import { ChangeEvent, useCallback } from 'react';
import { Funnel } from '@/components/Funnel';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';

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
            <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="sposnored" mb="0">
                    Enable ERC20 Sponsored Transactions
                </FormLabel>
                <Switch id="sposnored" size="lg" onChange={handleOnChange} />
            </FormControl>
            <UserAssets address={wallet} />
            <Funnel address={wallet} />
            {/* <ReservesIncentives address={wallet} />
            <UserSummary address={wallet} />
            <Deposit />
            <SendTx />
            <SendErc20Tx /> */}
            <Button
                variant={'solid'}
                colorScheme="purple"
                onClick={logout}
                size="lg"
            >
                Logout
            </Button>
        </VStack>
    );
};
