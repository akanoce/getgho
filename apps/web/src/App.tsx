import { useState } from 'react';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { TProviderWithSigner } from 'passkeys';

export const App = () => {
    const [wallet, setWallet] = useState<string | undefined>();

    const [providerWithSigner, setProviderWithSigner] = useState<
        TProviderWithSigner | undefined
    >();

    const loggedIn = !!wallet;
    return loggedIn ? (
        <Home wallet={wallet} setWallet={setWallet} />
    ) : (
        <Onboarding
            setProviderWithSigner={setProviderWithSigner}
            setWallet={setWallet}
        />
    );
};
