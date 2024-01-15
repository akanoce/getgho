import { useRef } from 'react';
import { TWalletDetails } from '@repo/passkeys/model';
import {
    avalancheFuji,
    baseGoerli,
    optimismGoerli,
    arbitrumSepolia,
    polygonMumbai
} from 'viem/chains';
import {
    buildUserOperation,
    generateInitCode,
    getFactoryAddress,
    getPimlicoBundlerClient,
    getPimlicoPaymasterClient,
    signUserOperationWithPasskey
} from '..';
import { BundlerClient, UserOperation, getSenderAddress } from 'permissionless';
import {
    Hex,
    Address,
    http,
    createPublicClient,
    encodeFunctionData,
    labelhash,
    namehash,
    LocalAccount
} from 'viem';
import { PimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { useCounterFactualAddress } from '../../../passkeys/src/store';
import {
    fifsRegistrarCcipABI,
    fifsRegistrarCcipAddress,
    publicResolverCcipAddress,
    reverseRegistrarCcipAddress,
    simpleAccountABI
} from '../../util';

const hubChain = arbitrumSepolia;

const publicClient = createPublicClient({
    transport: http(hubChain.rpcUrls.alchemy.http[0]),
    chain: hubChain
});

export const usePimlico = () => {
    const { addressRecords, setAdressRecords } = useCounterFactualAddress();

    const initCodeRef = useRef<Hex>();
    const hubBundlerClientRef = useRef<BundlerClient>();
    const hubPaymasterClientRef = useRef<PimlicoPaymasterClient>();
    const hubEntryPointRef = useRef<Hex>();
    const hubSenderRef = useRef<Hex>();

    const determineCounterfactualAddresses = async (
        viemAccount: LocalAccount
    ) => {
        const chains = [
            avalancheFuji,
            polygonMumbai,
            optimismGoerli,
            arbitrumSepolia,
            baseGoerli
        ];

        for (const chain of chains) {
            const initCode = generateInitCode(
                getFactoryAddress(),
                viemAccount.address as Address
            );
            const bundlerClient = await getPimlicoBundlerClient(chain);

            // Get entry point address
            const entryPoint = (
                await bundlerClient.supportedEntryPoints()
            )?.[0];

            console.log(
                `Entry point for '${chain.name}' (${chain.id}):`,
                entryPoint
            );

            if (!entryPoint)
                throw new Error(
                    `No entry point found for '${chain.name}' (${chain.id})`
                );

            // Calculate counterfactual address
            const sender = await getSenderAddress(publicClient, {
                initCode,
                entryPoint
            });

            console.log(
                `Counterfactual address on '${chain.name}' (${chain.id}): ${sender}`
            );

            setAdressRecords({ [chain.id]: sender });

            // Store state for performance reasons
            if (chain.id === hubChain.id) {
                initCodeRef.current = initCode;
                hubBundlerClientRef.current = bundlerClient;
                hubPaymasterClientRef.current =
                    await getPimlicoPaymasterClient(hubChain);
                hubEntryPointRef.current = entryPoint;
                hubSenderRef.current = sender;
            }
        }
    };

    const createSmartWallets = async (viemAccount: LocalAccount) => {
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
            // Build callData for domain registration & set-addresses
            const callData = encodeFunctionData({
                abi: simpleAccountABI,
                functionName: 'executeBatch',
                args: [
                    [
                        fifsRegistrarCcipAddress[
                            hubChain.id as keyof typeof fifsRegistrarCcipAddress
                        ],
                        publicResolverCcipAddress[
                            hubChain.id as keyof typeof publicResolverCcipAddress
                        ],
                        reverseRegistrarCcipAddress[
                            hubChain.id as keyof typeof reverseRegistrarCcipAddress
                        ],
                        ...Object.keys(determineCounterfactualAddresses).map(
                            () =>
                                publicResolverCcipAddress[
                                    hubChain.id as keyof typeof publicResolverCcipAddress
                                ]
                        )
                    ],
                    [
                        encodeFunctionData({
                            abi: fifsRegistrarCcipABI,
                            functionName: 'register',
                            args: [labelhash(domainName), hubSenderRef.current]
                        }),
                        encodeFunctionData({
                            abi: publicResolverCcipABI,
                            functionName: 'setAddr',
                            args: [namehash(domain), hubSenderRef.current]
                        }),
                        encodeFunctionData({
                            abi: reverseRegistrarCcipABI,
                            functionName: 'setName',
                            args: [domain]
                        }),
                        ...Object.entries(counterfactualAddresses).map(
                            ([chainId, address]) =>
                                encodeFunctionData({
                                    abi: publicResolverCcipABI,
                                    functionName: 'setAddr',
                                    args: [
                                        namehash(domain),
                                        BigInt(
                                            convertEVMChainIdToCoinType(
                                                parseInt(chainId)
                                            )
                                        ),
                                        address
                                    ]
                                })
                        )
                    ]
                ]
            });

            console.log(
                'Generated domain registration & set-address batch callData:',
                callData
            );

            // Build useroperation
            let userOperation = (await buildUserOperation({
                sender: hubSenderRef.current,
                entryPoint: hubEntryPointRef.current,
                callData,
                bundlerClient: hubBundlerClientRef.current,
                publicClient,
                initCode: initCodeRef.current
            })) as UserOperation;

            console.log('Built userOperation:', userOperation);

            // Sponsor the useroperation
            const sponsorParams =
                await hubPaymasterClientRef.current.sponsorUserOperation({
                    userOperation,
                    entryPoint: hubEntryPointRef.current
                });
            userOperation = { ...userOperation, ...sponsorParams };
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

            console.log(`Transaction hash: ${txHash}`);

            // Set domain context & edirect to dashboard on success
            // setDomainContext({ domain, domainName, domainTld });
        } catch (error) {
            console.error(error);
        }
    };

    return {
        determineCounterfactualAddresses,
        addressRecords,
        createSmartWallets
    };
};
