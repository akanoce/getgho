import { useRef } from 'react';
import { sepolia } from 'viem/chains';
import {
    buildUserOperation,
    generateInitCode,
    getFactoryAddress,
    getPimlicoBundlerClient,
    pimpim,
    signUserOperationWithPasskey
} from '..';
import { BundlerClient, UserOperation, getSenderAddress } from 'permissionless';
import {
    Hex,
    Address,
    http,
    createPublicClient,
    encodeFunctionData,
    LocalAccount,
    WalletClient
} from 'viem';
import { PimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { simpleAccountABI } from '../../util';
import { AppConfig } from '@repo/config';

const hubChain = sepolia;

const publicClient = (alchemyApiKey: string) =>
    createPublicClient({
        transport: http(hubChain.rpcUrls.alchemy.http[0], {
            fetchOptions: {
                headers: {
                    Authorization: `Bearer ${alchemyApiKey}`
                }
            }
        }),
        chain: hubChain
    });

export const usePimlico = (
    setAddressRecords: (
        AddressRecords: Record<string, `0x${string}`> | undefined
    ) => void
) => {
    const initCodeRef = useRef<Hex>();
    const hubBundlerClientRef = useRef<BundlerClient>();
    const hubPaymasterClientRef = useRef<PimlicoPaymasterClient>();
    const hubEntryPointRef = useRef<Hex>();
    const hubSenderRef = useRef<Hex>();

    const determineCounterfactualAddresses = async ({
        config,
        viemAccount
    }: {
        config: AppConfig;
        viemAccount: LocalAccount;
    }) => {
        // can add more chains here - follow unwallet examples for more info es. [sepolia, avalancheFuji, baseGoerli, optimismGoerli, arbitrumSepolia, polygonMumbai]
        const chain = sepolia;

        const initCode = generateInitCode(
            // most chains already have deployed a SimpleAccountFactory.sol contract, that is able to easily deploy new SimpleAccount instances via the createAccount function
            getFactoryAddress(),
            viemAccount.address as Address
        );

        const bundlerClient = await getPimlicoBundlerClient({ chain, config });

        // a contract that receives UserOperations from bundlers, validates them, pays for gas, and executes them.
        const entryPoint = (await bundlerClient.supportedEntryPoints())?.[0];

        console.log(
            `Entry point for '${chain.name}' (${chain.id}):`,
            entryPoint
        );

        if (!entryPoint)
            throw new Error(
                `No entry point found for '${chain.name}' (${chain.id})`
            );

        // the address the SimpleAccount will be deployed to
        // the address which will handle the verification and execution steps of the UserOperation
        // the address of the smart wallet
        const sender = await getSenderAddress(
            publicClient(config.alchemyApiKey),
            {
                initCode,
                entryPoint
            }
        );

        console.log(
            `Counterfactual address on '${chain.name}' (${chain.id}): ${sender}`
        );

        // Saves smart wallet address to store
        // TODO - this is called every time the user logs in, but it should only be called once OR
        // TODO - it should not save the same address twice
        setAddressRecords({ [chain.id]: sender });

        const hubPaymasterClient: PimlicoPaymasterClient = pimpim({
            chain,
            config
        });

        // Store state for performance reasons
        if (chain.id === hubChain.id) {
            initCodeRef.current = initCode;
            hubBundlerClientRef.current = bundlerClient;
            hubPaymasterClientRef.current = hubPaymasterClient;
            hubEntryPointRef.current = entryPoint;
            hubSenderRef.current = sender;
        }
    };

    const createSmartWallets = async ({
        config,
        viemAccount
    }: {
        config: AppConfig;
        viemAccount: LocalAccount;
    }) => {
        if (
            !viemAccount ||
            !initCodeRef.current ||
            !hubBundlerClientRef.current ||
            !hubPaymasterClientRef.current ||
            !hubEntryPointRef.current ||
            !hubSenderRef.current
        )
            return;

        try {
            const to = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // vitalik
            const value = 0n;
            const data = '0x68656c6c6f'; // "hello" encoded to utf-8 bytes

            const callData = encodeFunctionData({
                abi: simpleAccountABI,
                functionName: 'execute',
                args: [to, value, data]
            });

            console.log(
                'Generated domain registration & set-address batch callData:',
                callData
            );

            // Build useroperation
            // pseudo-transaction objects that are used to execute transactions with contract accounts. They contain information such as nonce, gas limit, gas price, initCode or target, data, signature, etc.
            let userOperation = (await buildUserOperation({
                sender: hubSenderRef.current,
                entryPoint: hubEntryPointRef.current,
                callData,
                bundlerClient: hubBundlerClientRef.current,
                publicClient: publicClient(config.alchemyApiKey),
                initCode: initCodeRef.current
            })) as UserOperation;

            console.log('Built userOperation:', userOperation);

            // Sponsor the useroperation
            const sponsorParams =
                await hubPaymasterClientRef.current.sponsorUserOperation({
                    userOperation,
                    entryPoint: hubEntryPointRef.current
                });

            userOperation = {
                ...userOperation,
                ...sponsorParams,
                preVerificationGas: sponsorParams.preVerificationGas,
                verificationGasLimit: sponsorParams.verificationGasLimit,
                callGasLimit: sponsorParams.callGasLimit,
                paymasterAndData: sponsorParams.paymasterAndData
            };

            console.log('Sponsored userOperation:', userOperation);

            // Sign the useroperation

            const signature = await signUserOperationWithPasskey({
                viemAccount,
                userOperation,
                chain: hubChain,
                entryPoint: hubEntryPointRef.current
            });

            userOperation = { ...userOperation, signature };

            console.log('Signed userOperation:', userOperation);

            // Send the useroperation
            const hash = await hubBundlerClientRef.current.sendUserOperation({
                userOperation,
                entryPoint: hubEntryPointRef.current
            });

            console.log('Sent userOperation:', hash);

            console.log('Querying for receipts...');

            const receipt =
                await hubBundlerClientRef.current.waitForUserOperationReceipt({
                    hash
                });

            const txHash = receipt.receipt.transactionHash;

            console.log(
                `Transaction hash: https://sepolia.etherscan.io/tx/${txHash}`
            );
        } catch (error) {
            console.error(error);
        }
    };

    return {
        determineCounterfactualAddresses,
        createSmartWallets
    };
};
