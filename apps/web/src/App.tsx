import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useReserves, useReservesIncentives } from './api';
import { useCounterFactualAddress, useLogin, useSignup } from '@repo/lfgho-sdk';
import { sepolia } from 'wagmi';

export const App = () => {
    const { signup } = useSignup();
    const { login } = useLogin();
    const { addressRecords } = useCounterFactualAddress();

    const { data: reserves } = useReserves();
    const { data: incentives } = useReservesIncentives();
    const loggedIn = !!addressRecords?.[sepolia.id];
    const wallet = addressRecords?.[sepolia.id];

    console.log({ reserves, incentives });

    return loggedIn ? (
        <Home wallet={wallet!} logout={() => {}} />
    ) : (
        <Onboarding login={login} signup={signup} />
    );
};
