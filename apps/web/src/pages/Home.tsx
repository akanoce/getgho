import { ShimmerButton } from '../components';
import { useTurnkey } from '../hooks';
// import { useCallback, useState } from 'react';
// import { createTurnkeySigner } from 'passkeys';

export const Home = () => {
    const { wallet, login, createSubOrgAndWallet } = useTurnkey();
    console.log(wallet);

    /*
         We should change the hook with the package sdk
    */
    // const [wallet, setWallet] = useState<string | undefined>();
    // const [subOrgId, setSubOrgId] = useState<string | undefined>();

    // const getTurnkeysAndSigner = useCallback(async () => {
    //     const res = await createTurnkeySigner();
    //     if (!res) return console.log('No response form turnkeys');
    //     const { turnkeySigner, wallet, subOrgId } = res;
    //     console.log({ turnkeySigner, wallet, subOrgId });

    //     setSubOrgId(subOrgId);
    //     setWallet(wallet);
    // }, []);

    return (
        <div className="flex justify-center items-center h-[100vh]">
            <a>{JSON.stringify(wallet) ?? ''}</a>
            {/* <a>{JSON.stringify(subOrgId) ?? ''}</a> */}

            <div className="flex flex-col gap-y-4">
                {!wallet && (
                    <>
                        <ShimmerButton
                            className="h-14 shadow-2xl"
                            shimmerColor="purple"
                            shimmerSize="0.1em"
                            background="white"
                            onClick={createSubOrgAndWallet}
                            // onClick={getTurnkeysAndSigner}
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
