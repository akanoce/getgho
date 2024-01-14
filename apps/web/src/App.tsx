import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useWallet } from './hooks';

export const App = () => {
    const { wallet } = useWallet();

    return wallet ? <Home /> : <Onboarding />;
};
