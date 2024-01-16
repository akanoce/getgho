import { Address, LocalAccount } from 'viem';
import { sepolia } from 'viem/chains';
import { config } from '@repo/config';
import { generateInitCode } from './generateInitCode';
import { FACTORY_ADDRESS } from '../const';
import { getSenderAddress } from 'permissionless';

export const getCounterfactualAddresses = async ({
    viemAccount
}: {
    viemAccount: LocalAccount;
}) => {
    const initCode = generateInitCode(
        // most chains already have deployed a SimpleAccountFactory.sol contract, that is able to easily deploy new SimpleAccount instances via the createAccount function
        FACTORY_ADDRESS,
        viemAccount.address as Address
    );

    const bundlerClient = await getPimlicoBundlerClient({ sepolia });

    // a contract that receives UserOperations from bundlers, validates them, pays for gas, and executes them.
    const entryPoint = (await bundlerClient.supportedEntryPoints())?.[0];

    console.log(
        `Entry point for '${sepolia.name}' (${sepolia.id}):`,
        entryPoint
    );

    if (!entryPoint)
        throw new Error(
            `No entry point found for '${sepolia.name}' (${sepolia.id})`
        );

    // the address the SimpleAccount will be deployed to
    // the address which will handle the verification and execution steps of the UserOperation
    // the address of the smart wallet
    const sender = await getSenderAddress(publicClient(config.alchemyApiKey), {
        initCode,
        entryPoint
    });

    console.log(
        `Counterfactual address on '${sepolia.name}' (${sepolia.id}): ${sender}`
    );

    // Saves smart wallet address to store
    // TODO - this is called every time the user logs in, but it should only be called once OR
    // TODO - it should not save the same address twice
    setAddressRecords({ [sepolia.id]: sender });

    // Store state for performance reasons
    if (chain.id === hubChain.id) {
        initCodeRef.current = initCode;
        hubBundlerClientRef.current = bundlerClient;
        hubPaymasterClientRef.current = hubPaymasterClient;
        hubEntryPointRef.current = entryPoint;
        hubSenderRef.current = sender;
    }
};
