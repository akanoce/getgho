import { ShimmerButton } from '../components';
import { useCallback, useState } from 'react';
import {
    TPasskeysConfig,
    TProviderWithSigner,
    getProviderWithSigner
} from 'passkeys';
import { sepolia } from 'viem/chains';

const config: TPasskeysConfig = {
    VITE_ORGANIZATION_ID: import.meta.env.VITE_ORGANIZATION_ID!,
    VITE_TURNKEY_API_BASE_URL: import.meta.env.VITE_TURNKEY_API_BASE_URL!,
    VITE_API_PUBLIC_KEY: import.meta.env.VITE_API_PUBLIC_KEY!,
    VITE_API_PRIVATE_KEY: import.meta.env.VITE_API_PRIVATE_KEY!,
    VITE_ALCHEMY_KEY: import.meta.env.VITE_ALCHEMY_KEY!,
    CHAIN: sepolia
};

export const Home = () => {
    const [wallet, setWallet] = useState<string | undefined>();
    const [providerWithSigner, setProviderWithSigner] = useState<
        TProviderWithSigner | undefined
    >();

    const getTurnkeysAndSigner = useCallback(async () => {
        const provider = await getProviderWithSigner({ config });
        if (!provider) return console.log('No response form turnkeys');

        const adderss = await provider.getAddress();
        setProviderWithSigner(provider);
        setWallet(adderss);
    }, []);

    console.log({ providerWithSigner });

    return (
        <div className="flex justify-center items-center h-[100vh]">
            {wallet && (
                <div className="flex flex-col gap-y-4">
                    <a>Wallet Address : {JSON.stringify(wallet) ?? ''}</a>
                </div>
            )}

            <div className="flex flex-col gap-y-4">
                {!wallet && (
                    <>
                        <ShimmerButton
                            className="h-14 shadow-2xl"
                            shimmerColor="purple"
                            shimmerSize="0.1em"
                            background="white"
                            // onClick={createSubOrgAndWallet}
                            onClick={getTurnkeysAndSigner}
                        >
                            <span className="px-1 text-center font-bold leading-none">
                                Get a wallet
                            </span>
                        </ShimmerButton>

                        <ShimmerButton
                            className="h-14 shadow-2xl"
                            shimmerColor="purple"
                            shimmerSize="0.1em"
                            background="white"
                            // onClick={login}
                        >
                            <span className="px-1 text-center font-bold leading-none">
                                Have a wallet?
                            </span>
                        </ShimmerButton>
                    </>
                )}
            </div>
        </div>
    );

    // ConnectKit should be used when depositing instead of logging in
    /* 
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();

    if (!isConnected) return <ConnectKitButton />;

    return (
        <div>
            <h1>Home</h1>
            <p>Connected network: {chain?.name}</p>
            <p>Address: {address}</p>
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    ); */
};
