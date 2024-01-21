import { createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { config as appConfig } from '@repo/config';

declare module 'wagmi' {
    interface Register {
        config: typeof config;
    }
}

const envConfig = {
    alchemyId: appConfig.alchemyApiKey,
    walletConnectProjectId: appConfig.walletConnectProjectId
};

export const config = createConfig(
    getDefaultConfig({
        // Required API Keys
        chains: [sepolia],
        alchemyId: envConfig.alchemyId,
        walletConnectProjectId: envConfig.walletConnectProjectId,
        // Required
        appName: 'Your App Name',
        // Optional
        appDescription: 'Your App Description',
        appUrl: 'https://family.co', // your app's url
        appIcon: 'https://family.co/logo.png' // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
);
