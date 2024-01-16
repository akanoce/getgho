import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useTurnkeySigner } from '@repo/passkeys';
import { config } from '@repo/config';
import { useUserReservesIncentives } from './api';

export const App = () => {
    const {
        wallet,
        signer,
        login,
        createSubOrgAndWallet,
        logout,
        ethersProvider
    } = useTurnkeySigner(config);

    const { data: userReservesIncentives } = useUserReservesIncentives(
        wallet?.address
    );
    const loggedIn = !!wallet;

    console.log({ userReservesIncentives });

    return loggedIn ? (
        <Home
            wallet={wallet}
            logout={logout}
            ethersProvider={ethersProvider}
            signer={signer}
        />
    ) : (
        <Onboarding login={login} create={createSubOrgAndWallet} />
    );
};
