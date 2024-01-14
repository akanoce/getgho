import { useEffect } from 'react';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useTurnkeySigner } from '@repo/passkeys';
import { TPasskeysConfig } from '@repo/passkeys/model';
import { fetchContractData } from './api/aave';

const config: TPasskeysConfig = {
    VITE_ORGANIZATION_ID: import.meta.env.VITE_ORGANIZATION_ID!,
    VITE_TURNKEY_API_BASE_URL: import.meta.env.VITE_TURNKEY_API_BASE_URL!,
    VITE_API_PUBLIC_KEY: import.meta.env.VITE_API_PUBLIC_KEY!,
    VITE_API_PRIVATE_KEY: import.meta.env.VITE_API_PRIVATE_KEY!,
    VITE_ALCHEMY_KEY: import.meta.env.VITE_ALCHEMY_KEY!
};

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
