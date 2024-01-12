import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export const Home = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <ConnectKitButton />;

  return (
    <div>
      <h1>Home</h1>
      <p>Address: {address}</p>
    </div>
  );
};
