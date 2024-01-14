import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { useTurnkey } from './hooks';

export const App = () => {
    const { wallet } = useTurnkey();
    const loggedIn = !!wallet;
    return loggedIn ? <Home /> : <Onboarding />;
};
