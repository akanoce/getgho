import { ShimmerButton } from '../components';
import { useTurnkey } from '../hooks';

export const Home = () => {
    const { wallet, login, createSubOrgAndWallet } = useTurnkey();

    console.log(wallet);

    return (
        <div className="flex justify-center items-center h-[100vh]">
            <a>{JSON.stringify(wallet) ?? ''}</a>
            <div className="flex flex-col gap-y-4">
                {!wallet && (
                    <>
                        <ShimmerButton
                            className="h-14 shadow-2xl"
                            shimmerColor="purple"
                            shimmerSize="0.1em"
                            background="white"
                            onClick={createSubOrgAndWallet}
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
                            onClick={login}
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
