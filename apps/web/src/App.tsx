import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useTurnkeySigner } from '@repo/passkeys';
import { config } from '@repo/config';
import { useReserves, useReservesIncentives } from './api';

export const App = () => {
    const {
        wallet,
        signer,
        login,
        createSubOrgAndWallet,
        logout,
        ethersProvider
    } = useTurnkeySigner(config);

    const { data: reserves } = useReserves();
    const { data: incentives } = useReservesIncentives();
    const loggedIn = !!wallet;

    console.log({ reserves, incentives });

    return loggedIn ? (
        <Home wallet={wallet} logout={logout} />
    ) : (
        <Onboarding login={login} create={createSubOrgAndWallet} />
    );
};
