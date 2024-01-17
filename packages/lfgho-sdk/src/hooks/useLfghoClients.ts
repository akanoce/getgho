import { getViemPublicClient } from '../_viem';
import { PublicClient, Transport, WalletClient } from 'viem';
import {
    PimlicoBundlerClient,
    PimlicoPaymasterClient
} from 'permissionless/clients/pimlico';
import { useViemSigner } from '../store';
import {
    getPimlicoBundlerClient,
    getPimlicoPaymasterClient
} from '../_pimlico';
import { ethers } from 'ethers';

export type LfghoContextType = {
    viemSigner: WalletClient | undefined;
    viemPublicClient: PublicClient;
    pimlicoBundler: PimlicoBundlerClient;
    pimlicoPaymaster: PimlicoPaymasterClient;
    ethersProvider: EtherCustomProvider;
};

export const useLfghoClients = (): LfghoContextType => {
    const { viemSigner } = useViemSigner();

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

    return {
        viemSigner,
        viemPublicClient,
        pimlicoBundler,
        pimlicoPaymaster,
        ethersProvider
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
