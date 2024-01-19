import { Deposit, SendSponsoredTx, SendSponsoredErc20Tx } from '@/components';
import { Address } from 'viem';
import { UserSummary } from '@/components/UserSummary';
import { ReservesIncentives } from '@/components/ReservesIncentives';
import { Button, VStack } from '@chakra-ui/react';

type Props = {
    wallet: Address;
    logout: () => void;
};

export const Home = ({ wallet, logout }: Props) => {
    return (
        <>
            {wallet && (
                <VStack spacing={4} alignItems={'stretch'} w="full">
                    <ReservesIncentives address={wallet} />
                    <UserSummary address={wallet} />
                    <Deposit />
                    <SendSponsoredTx />
                    <SendSponsoredErc20Tx />
                    <Button
                        variant={'solid'}
                        colorScheme="purple"
                        onClick={logout}
                        size="lg"
                    >
                        Logout
                    </Button>
                </VStack>
            )}
        </>
    );
};
