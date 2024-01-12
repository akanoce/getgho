import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

export const Home = () => {
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
  );
};
