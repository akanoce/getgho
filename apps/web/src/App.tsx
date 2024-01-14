import { useTurnkeySigner } from 'passkeys';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { TPasskeysConfig } from 'passkeys/model';

const config: TPasskeysConfig = {
    VITE_ORGANIZATION_ID: import.meta.env.VITE_ORGANIZATION_ID!,
    VITE_TURNKEY_API_BASE_URL: import.meta.env.VITE_TURNKEY_API_BASE_URL!,
    VITE_API_PUBLIC_KEY: import.meta.env.VITE_API_PUBLIC_KEY!,
    VITE_API_PRIVATE_KEY: import.meta.env.VITE_API_PRIVATE_KEY!,
    VITE_ALCHEMY_KEY: import.meta.env.VITE_ALCHEMY_KEY!
};

export const App = () => {
    const { wallet, signer, login, createSubOrgAndWallet, logout } =
        useTurnkeySigner(config);

    console.log(signer);

    const loggedIn = !!wallet;
    return loggedIn ? (
        <Home wallet={wallet} logout={logout} />
    ) : (
        <Onboarding login={login} create={createSubOrgAndWallet} />
    );
};
