import { useCallback } from 'react';
import {
    getViemPublicClient,
    createViemSigner,
    createTurnkeyViemAccount
} from '../_viem';
import { PublicClient, Transport, LocalAccount, WalletClient } from 'viem';
import {
    PimlicoBundlerClient,
    PimlicoPaymasterClient
} from 'permissionless/clients/pimlico';

import {
    getPimlicoBundlerClient,
    getPimlicoPaymasterClient
} from '../_pimlico';
import { ethers } from 'ethers';
import isEqual from 'lodash/isEqual';

const LOCAL_STORAGE_KEY = 'lfgho/turnkey-view-account-data';

export type LfghoContextType = {
    viemPublicClient: PublicClient;
    pimlicoBundler: PimlicoBundlerClient;
    pimlicoPaymaster: PimlicoPaymasterClient;
    ethersProvider: EtherCustomProvider;
    createViemInstance: (
        data: CreateTurnkeyViemAccountData
    ) => Promise<ViemInstance>;
    deleteViemAccount: () => void;
    getViemInstance: () => Promise<ViemInstance>;
};

export const useLfghoClients = (): LfghoContextType => {
    const publicClientSingleton = PublicClientSingleton.getInstance();
    const viemPublicClient = publicClientSingleton.getLibraryInstance();

    const pimlicoBundlerClientSingleton =
        PimlicoBundlerClientSingleton.getInstance();
    const pimlicoBundler = pimlicoBundlerClientSingleton.getLibraryInstance();

    const pimlicoPaymasterClientSingleton =
        PimlicoPaymasterClientSingleton.getInstance();
    const pimlicoPaymaster =
        pimlicoPaymasterClientSingleton.getLibraryInstance();

    const ethersProviderSingleton =
        EthersProviderSingleton.getInstance(viemPublicClient);
    const ethersProvider = ethersProviderSingleton.getLibraryInstance();

    const createViemInstance = useCallback(
        async (data: CreateTurnkeyViemAccountData): Promise<ViemInstance> => {
            if (isEqual(data, getPersistedData())) {
                if (viemCache.instance) {
                    return viemCache.instance;
                } else {
                    return await viemCache.createAndCacheInstance(data);
                }
            } else {
                setPersistedData(data);
                return await viemCache.createAndCacheInstance(data);
            }
        },
        []
    );

    const getViemInstance = useCallback(async (): Promise<ViemInstance> => {
        if (viemCache.instance) {
            return viemCache.instance;
        } else {
            const persistedData = getPersistedData();
            if (persistedData) {
                return await viemCache.createAndCacheInstance(persistedData);
            } else {
                throw new Error(
                    'create viem account before calling getViemInstance'
                );
            }
        }
    }, []);

    return {
        viemPublicClient,
        pimlicoBundler,
        pimlicoPaymaster,
        ethersProvider,
        getViemInstance,
        createViemInstance,
        deleteViemAccount: () => {
            viemCache.instance = undefined;
            resetPersistedData();
        }
    };
};

class PublicClientSingleton {
    private static instance: PublicClientSingleton;
    private libraryInstance: PublicClient;

    private constructor() {
        const publicClient = getViemPublicClient();
        this.libraryInstance = publicClient;
    }

    public static getInstance(): PublicClientSingleton {
        if (!PublicClientSingleton.instance) {
            PublicClientSingleton.instance = new PublicClientSingleton();
        }
        return PublicClientSingleton.instance;
    }

    public getLibraryInstance(): PublicClient {
        return this.libraryInstance;
    }
}

class PimlicoBundlerClientSingleton {
    private static instance: PimlicoBundlerClientSingleton;
    private libraryInstance: PimlicoBundlerClient;

    private constructor() {
        const bundlerClient = getPimlicoBundlerClient();
        this.libraryInstance = bundlerClient;
    }

    public static getInstance(): PimlicoBundlerClientSingleton {
        if (!PimlicoBundlerClientSingleton.instance) {
            PimlicoBundlerClientSingleton.instance =
                new PimlicoBundlerClientSingleton();
        }
        return PimlicoBundlerClientSingleton.instance;
    }

    public getLibraryInstance(): PimlicoBundlerClient {
        return this.libraryInstance;
    }
}

class PimlicoPaymasterClientSingleton {
    private static instance: PimlicoPaymasterClientSingleton;
    private libraryInstance: PimlicoPaymasterClient;

    private constructor() {
        const paymaster = getPimlicoPaymasterClient();
        this.libraryInstance = paymaster;
    }

    public static getInstance(): PimlicoPaymasterClientSingleton {
        if (!PimlicoPaymasterClientSingleton.instance) {
            PimlicoPaymasterClientSingleton.instance =
                new PimlicoPaymasterClientSingleton();
        }
        return PimlicoPaymasterClientSingleton.instance;
    }

    public getLibraryInstance(): PimlicoPaymasterClient {
        return this.libraryInstance;
    }
}

export type EtherCustomProvider =
    | ethers.providers.FallbackProvider
    | ethers.providers.JsonRpcProvider;

class EthersProviderSingleton {
    private static instance: EthersProviderSingleton;
    private libraryInstance: EtherCustomProvider;

    private constructor(client: PublicClient) {
        this.libraryInstance = clientToProvider(client);
    }

    public static getInstance(client: PublicClient): EthersProviderSingleton {
        if (!EthersProviderSingleton.instance) {
            EthersProviderSingleton.instance = new EthersProviderSingleton(
                client
            );
        }
        return EthersProviderSingleton.instance;
    }

    public getLibraryInstance(): EtherCustomProvider {
        return this.libraryInstance;
    }
}

const clientToProvider = (client: PublicClient) => {
    const { chain, transport } = client;

    if (!chain) throw new Error('Chain not found');

    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
    };

    if (transport.type === 'fallback')
        return new ethers.providers.FallbackProvider(
            (transport.transports as ReturnType<Transport>[]).map(
                ({ value }) =>
                    new ethers.providers.JsonRpcProvider(value?.url, network)
            )
        );

    return new ethers.providers.JsonRpcProvider(
        { url: transport.url, headers: transport.fetchOptions.headers },
        network
    );
};

export type ViemInstance = {
    account: LocalAccount;
    signer: WalletClient;
};

export type CreateTurnkeyViemAccountData = {
    id: string;
    address: string;
    subOrgId: string;
};

const viemCache = {
    instance: undefined as ViemInstance | undefined,
    createAndCacheInstance: async (data: CreateTurnkeyViemAccountData) => {
        const newAccount = await createTurnkeyViemAccount(data);
        viemCache.instance = {
            account: newAccount,
            signer: await createViemSigner(newAccount)
        };
        return viemCache.instance;
    }
};

const setPersistedData = (data: CreateTurnkeyViemAccountData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const resetPersistedData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

const getPersistedData = (): CreateTurnkeyViemAccountData | undefined => {
    const persistedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (persistedData) {
        return JSON.parse(persistedData);
    } else {
        return undefined;
    }
};
