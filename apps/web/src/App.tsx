import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useUserReservesIncentives } from './api';
import {
    useCounterFactualAddress,
    useLogin,
    useLogout,
    useSignup
} from '@repo/lfgho-sdk';
import { sepolia } from 'wagmi';

export const App = () => {
    const { signup } = useSignup();
    const { login } = useLogin();
    const logout = useLogout();
    const { addressRecords } = useCounterFactualAddress();
    const loggedIn = !!addressRecords?.[sepolia.id];
    const wallet = addressRecords?.[sepolia.id];

    const { data: userReservesIncentives } = useUserReservesIncentives(wallet);

    console.log({ userReservesIncentives });

    return loggedIn ? (
        <Home wallet={wallet!} logout={logout} />
    ) : (
        <Onboarding login={login} signup={signup} />
    );
};
