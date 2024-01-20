import { Address } from 'viem';
import { VStack } from '@chakra-ui/react';
import { UserAssets } from '@/components/UserAssets';

type Props = {
    wallet: Address;
};

export const Home = ({ wallet }: Props) => {
    return (
        <VStack spacing={4} alignItems={'stretch'} w="full">
            <UserAssets address={wallet} />
            {/* <ReservesIncentives address={wallet} />
            <UserSummary address={wallet} />
            <Deposit />
            <SendTx />
            <SendErc20Tx />
            <Button
                variant={'solid'}
                colorScheme="purple"
                onClick={logout}
                size="lg"
            >
                Logout
            </Button> */}
        </VStack>
    );
};
