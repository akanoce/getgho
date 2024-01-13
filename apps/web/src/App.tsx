import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { Home } from './pages/Home';
import { config } from './config';

export const App = () => {
    return (
        <WagmiConfig config={config}>
            <ConnectKitProvider>
                <Home />
            </ConnectKitProvider>
        </WagmiConfig>
    );
};
