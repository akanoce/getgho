import { Address, LocalAccount, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import { generateInitCode } from './generateInitCode';
import { FACTORY_ADDRESS } from '../const';
import { getSenderAddress } from 'permissionless';
import { PimlicoBundlerClient } from 'permissionless/clients/pimlico';

export const getCounterfactualAddresses = async ({
    viemAccount,
    viemPublicClient,
    pimlicoBundler
}: {
    viemAccount: LocalAccount;
    viemPublicClient: PublicClient;
    pimlicoBundler: PimlicoBundlerClient;
}) => {
    const initCode = generateInitCode(
        // most chains already have deployed a SimpleAccountFactory.sol contract, that is able to easily deploy new SimpleAccount instances via the createAccount function
        FACTORY_ADDRESS,
        viemAccount.address as Address
    );

    // a contract that receives UserOperations from bundlers, validates them, pays for gas, and executes them.
    const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];

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
    const sender = await getSenderAddress(viemPublicClient, {
        initCode,
        entryPoint
    });

    console.log(
        `Counterfactual address on '${sepolia.name}' (${sepolia.id}): ${sender}`
    );

    return { sender, entryPoint, initCode };
};
