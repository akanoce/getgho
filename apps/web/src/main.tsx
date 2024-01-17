import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { config } from './config';
import { App } from './App';
import { AaveContractsProvider } from './providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            staleTime: 30000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchInterval: false,
            refetchIntervalInBackground: false
        }
    }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <AaveContractsProvider>
                    <ConnectKitProvider>
                        <App />
                    </ConnectKitProvider>
                </AaveContractsProvider>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </WagmiConfig>
    </React.StrictMode>
);
