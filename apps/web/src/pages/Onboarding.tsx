import { useCallback } from 'react';
import { ShimmerButton } from '../components';
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

export const Onboarding = ({
    setProviderWithSigner,
    setWallet
}: {
    setProviderWithSigner: React.Dispatch<
        React.SetStateAction<TProviderWithSigner | undefined>
    >;
    setWallet: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
    const getTurnkeysAndSigner = useCallback(
        async ({ type }: { type: 'login' | 'signup' }) => {
            const provider = await getProviderWithSigner({ config, type });
            if (!provider) return console.log('No response form turnkeys');

            const adderss = await provider.getAddress();
            setProviderWithSigner(provider);
            setWallet(adderss);
        },
        []
    );

    return (
        <div className="flex justify-center items-center h-[100vh]">
            <div className="flex flex-col gap-y-4">
                <ShimmerButton
                    className="h-14 shadow-2xl"
                    shimmerColor="purple"
                    shimmerSize="0.1em"
                    background="white"
                    onClick={() => getTurnkeysAndSigner({ type: 'signup' })}
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
                    onClick={() => getTurnkeysAndSigner({ type: 'login' })}
                >
                    <span className="px-1 text-center font-bold leading-none">
                        Have a wallet?
                    </span>
                </ShimmerButton>
            </div>
        </div>
    );
};
