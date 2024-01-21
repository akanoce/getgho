import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { config } from './config';
import { App } from './App';
import { AaveContractsProvider } from './providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/montserrat/600.css';
import { config as appConfig } from '@repo/config';

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

console.log({ appConfig });

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <WagmiConfig config={config}>
                <QueryClientProvider client={queryClient}>
                    <AaveContractsProvider>
                        <ConnectKitProvider>
                            <App />
                        </ConnectKitProvider>
                    </AaveContractsProvider>
                </QueryClientProvider>
            </WagmiConfig>
        </ChakraProvider>
    </React.StrictMode>
);
