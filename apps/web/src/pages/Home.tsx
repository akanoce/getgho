import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
// import { createTurnkeySigner } from "passkeys";
import { useCallback } from "react";

export const Home = () => {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();

    const turnKeySinger = useCallback(async () => {
        // const signer = await createTurnkeySigner();
        // console.log({ signer });
    }, []);

    if (!isConnected) return <ConnectKitButton />;

    return (
        <div>
            <h1>Home</h1>
            <p>Connected network: {chain?.name}</p>
            <p>Address: {address}</p>
            <button onClick={() => disconnect()}>Disconnect</button>
            <button onClick={turnKeySinger}>Turnkey</button>
        </div>
    );
};
