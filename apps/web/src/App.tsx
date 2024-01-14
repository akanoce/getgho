import { useEffect } from 'react';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useTurnkeySigner } from '@repo/passkeys';
import { fetchContractData } from './api/aave';
import { config } from '@repo/config';

export const App = () => {
    const {
        wallet,
        signer,
        login,
        createSubOrgAndWallet,
        logout,
        ethersProvider
    } = useTurnkeySigner(config);

    const loggedIn = !!wallet;

    useEffect(() => {
        const fetchData = async () => {
            if (!ethersProvider || !signer?.account?.address) return;
            await fetchContractData(ethersProvider, signer?.account?.address);
        };
        fetchData();
    }, [ethersProvider, signer]);

    return loggedIn ? (
        <Home wallet={wallet} logout={logout} />
    ) : (
        <Onboarding login={login} create={createSubOrgAndWallet} />
    );
};
