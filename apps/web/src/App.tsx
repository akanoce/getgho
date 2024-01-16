import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useTurnkeySigner } from '@repo/passkeys';
import { config } from '@repo/config';
import { useUserReservesIncentives } from './api';

export const App = () => {
    const { wallet, login, createSubOrgAndWallet, logout } =
        useTurnkeySigner(config);

    const { data: userReservesIncentives } = useUserReservesIncentives(
        wallet?.address
    );
    const loggedIn = !!wallet;

    console.log({ userReservesIncentives });

    return loggedIn ? (
        <Home wallet={wallet} logout={logout} />
    ) : (
        <Onboarding login={login} create={createSubOrgAndWallet} />
    );
};
