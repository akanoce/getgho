import { Deposit, ShimmerButton } from '@/components';
import { LocalAccount } from 'viem';
import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

type Props = {
    wallet: LocalAccount;
    ethersProvider: FallbackProvider | JsonRpcProvider | undefined;
    signer: any;
    logout: () => void;
};

export const Home = ({ wallet, logout, ethersProvider, signer }: Props) => {
    const [balance, setBalance] = useState('0');
    useEffect(() => {
        async function init() {
            const _balance = await ethersProvider?.getBalance(
                signer?.account?.address
            );
            setBalance(_balance?.toString() ?? '0');
        }

        init();
    }, [ethersProvider, signer?.account?.address]);

    return (
        <div className="flex justify-center items-center h-[100vh]">
            {wallet && (
                <div className="flex flex-col gap-y-4">
                    <a>
                        Wallet Address : {JSON.stringify(wallet.address) ?? ''}
                    </a>
                    <a className="gap-y-2">Wallet balance : {balance}</a>
                    <Deposit />
                    <ShimmerButton
                        className="h-14 shadow-2xl"
                        shimmerColor="purple"
                        shimmerSize="0.1em"
                        background="white"
                        onClick={logout}
                    >
                        <span className="px-1 text-center font-bold leading-none">
                            Logout
                        </span>
                    </ShimmerButton>
                </div>
            )}
        </div>
    );
};
