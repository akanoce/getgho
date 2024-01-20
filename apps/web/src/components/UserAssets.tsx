import { useUserReservesIncentives } from '@/api';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';
import { Box, Button, Heading, Spinner, VStack } from '@chakra-ui/react';

type Props = {
    address: string;
};
export const UserAssets = ({ address }: Props) => {
    const { data: userReserves, isLoading: userReservesLoading } =
        useUserReservesIncentives(address);

    const { logout } = useAccountAdapter();

    console.log({ userReserves });
    return (
        <VStack spacing={4} alignItems={'stretch'} w="full">
            <Button
                alignSelf="flex-end"
                variant={'solid'}
                colorScheme="purple"
                onClick={logout}
                size="lg"
            >
                Logout
            </Button>
            <Box>
                {userReservesLoading ? (
                    <Spinner />
                ) : (
                    <Heading as="h2" size="lg">
                        User Assets
                    </Heading>
                )}
            </Box>
        </VStack>
    );
};
