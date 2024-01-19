import { Deposit, SendSponsoredTx } from '@/components';
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
                <VStack spacing={4} alignItems={'stretch'} py={4}>
                    <ReservesIncentives address={wallet} />
                    <UserSummary address={wallet} />
                    <Deposit />
                    <SendSponsoredTx />
                    <Button onClick={logout}>Logout</Button>
                </VStack>
            )}
        </>
    );
};
