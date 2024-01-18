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

import {} from 'viem';

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
        <div className="w-full flex justify-center items-center max-w-6xl px-16 py-8 mx-auto">
            {loggedIn ? (
                <Home wallet={addressToUse} logout={logout} />
            ) : (
                <Onboarding login={login} signup={signup} />
            )}
        </div>
    );
};
