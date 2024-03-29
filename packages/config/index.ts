export type AppConfig = {
    turnkeyOrganizationId: string;
    turnkeyApiBaseUrl: string;
    turnkeyApiPublicKey: string;
    turnkeyApiPrivateKey: string;
    alchemyApiKey: string;
    walletConnectProjectId: string;
    pimlicoApiKey: string;
    baseUrl: string;
    mixpanelToken?: string;
};

/**
 * Gets the app config from the environment variables
 * @returns {AppConfig} The app config
 */
const getConfig = (): AppConfig => {
    const turnkeyOrganizationId = import.meta.env.VITE_ORGANIZATION_ID;
    const turnkeyApiBaseUrl = import.meta.env.VITE_TURNKEY_API_BASE_URL;
    const turnkeyApiPublicKey = import.meta.env.VITE_API_PUBLIC_KEY;
    const turnkeyApiPrivateKey = import.meta.env.VITE_API_PRIVATE_KEY;
    const alchemyApiKey = import.meta.env.VITE_ALCHEMY_KEY;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const walletConnectProjectId = import.meta.env
        .VITE_WALLET_CONNECT_PROJECT_ID;
    const pimlicoApiKey = import.meta.env.VITE_PIMLICO_API_KEY;
    const mixpanelToken = import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN;

    if (!turnkeyOrganizationId)
        throw new Error('VITE_ORGANIZATION_ID is not defined');
    if (!turnkeyApiBaseUrl)
        throw new Error('VITE_TURNKEY_API_BASE_URL is not defined');
    if (!turnkeyApiPublicKey)
        throw new Error('VITE_API_PUBLIC_KEY is not defined');
    if (!turnkeyApiPrivateKey)
        throw new Error('VITE_API_PRIVATE_KEY is not defined');
    if (!alchemyApiKey) throw new Error('VITE_ALCHEMY_KEY is not defined');
    if (!walletConnectProjectId)
        throw new Error('VITE_WALLET_CONNECT_PROJECT_ID is not defined');
    if (!pimlicoApiKey) throw new Error('VITE_PIMLICO_API_KEY is not defined');

    return {
        turnkeyOrganizationId,
        turnkeyApiBaseUrl,
        turnkeyApiPublicKey,
        turnkeyApiPrivateKey,
        alchemyApiKey,
        walletConnectProjectId,
        pimlicoApiKey,
        baseUrl,
        mixpanelToken
    };
};

export const config = getConfig();
