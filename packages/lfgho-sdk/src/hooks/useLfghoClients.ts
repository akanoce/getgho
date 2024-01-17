import { getViemPublicClient } from '../_viem';
import { PublicClient, WalletClient } from 'viem';
import {
    PimlicoBundlerClient,
    PimlicoPaymasterClient
} from 'permissionless/clients/pimlico';
import { useViemSigner } from '../store';
import {
    getPimlicoBundlerClient,
    getPimlicoPaymasterClient
} from '../_pimlico';

export type LfghoContextType = {
    viemSigner: WalletClient | undefined;
    viemPublicClient: PublicClient;
    pimlicoBundler: PimlicoBundlerClient;
    pimlicoPaymaster: PimlicoPaymasterClient;
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

    return { viemSigner, viemPublicClient, pimlicoBundler, pimlicoPaymaster };
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
