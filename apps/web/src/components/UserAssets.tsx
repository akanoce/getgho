import { useReserves, useUserReservesIncentives } from '@/api';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';
import {
    Box,
    Button,
    HStack,
    Heading,
    Spinner,
    VStack
} from '@chakra-ui/react';

type Props = {
    address: string;
};
export const UserAssets = ({ address }: Props) => {
    const { logout } = useAccountAdapter();

    const { data: userReserves, isLoading: userReservesLoading } =
        useUserReservesIncentives(address);

    const { data: reserves, isLoading: reservesLoading } = useReserves();

    console.log({ userReserves, reserves });

    const availableUnderlying =
        userReserves?.formattedUserSummary.userReservesData.filter(
            (reserve) => reserve.underlyingBalance !== '0'
        );
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
                    <VStack w="full" spacing={4}>
                        {availableUnderlying?.map((reserve) => (
                            <HStack w="full" key={reserve.underlyingAsset}>
                                <Box>{reserve.reserve.symbol}</Box>
                                <Box>{reserve.underlyingBalanceUSD} USD</Box>
                            </HStack>
                        ))}
                    </VStack>
                )}
            </Box>
        </VStack>
    );
};
