import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { config } from './config';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig config={config}>
            <ConnectKitProvider>
                <App />
            </ConnectKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);
