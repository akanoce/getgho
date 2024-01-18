import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useUserReservesIncentives } from './api';
import {
    useCounterFactualAddress,
    useLogin,
    useLogout,
    useSignup
} from '@repo/lfgho-sdk';
import { sepolia, useAccount } from 'wagmi';
import { Box, Container, VStack } from '@chakra-ui/react';

export const App = () => {
    const { signup } = useSignup();
    const { login } = useLogin();
    const logout = useLogout();
    const { addressRecords } = useCounterFactualAddress();
    const smartAccountLoggedIn = !!addressRecords?.[sepolia.id];
    const smartAccountWallet = addressRecords?.[sepolia.id];
    const { address } = useAccount();

    const { data: userReservesIncentives } = useUserReservesIncentives(address);

    console.log({ userReservesIncentives });

    // const loggedIn = !!address;

    const loggedIn = !!address || !!smartAccountLoggedIn;
    const addressToUse = address || smartAccountWallet;

    return (
        <Box
            w="100vw"
            h="100vh"
            overflowY={'auto'}
            bgImage={`radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 70%,
            rgba(255, 255, 255, 0) 100%
        ),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%239C92AC' fill-opacity='0.25' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
        >
            <Container>
                <VStack
                    h="100vh"
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    {loggedIn ? (
                        <Home wallet={addressToUse!} logout={logout} />
                    ) : (
                        <Onboarding login={login} signup={signup} />
                    )}
                </VStack>
            </Container>
        </Box>
    );
};
