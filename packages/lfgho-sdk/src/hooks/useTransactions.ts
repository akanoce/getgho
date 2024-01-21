import { Address, Address, Hex, encodeFunctionData } from 'viem';
import { useCounterFactualAddress, useLfghoClients } from '..';
import {
    UserOperation,
    getAccountNonce,
    getRequiredPrefund
} from 'permissionless';
import { sepolia } from 'viem/chains';
import {
    ERC_20_PAYMASTER_ADDRESS,
    buildUserOperation,
    signUserOperationWithPasskey
} from '../_pimlico';
import { Interface } from 'ethers/lib/utils';
import { erc20abi, simpleAccountABI } from '../_pimlico/util';
import {
    EthereumTransactionTypeExtended,
    transactionType
} from '@aave/aave-utilities/packages/contract-helpers';
import { ethers } from 'ethers';
import { CCIP } from '../const';

export const useTransactions = () => {
    const {
        pimlicoBundler,
        viemPublicClient,
        getViemInstance,
        pimlicoPaymaster,
        ethersProvider
    } = useLfghoClients();
    const { addressRecords } = useCounterFactualAddress();
    const sender = addressRecords?.[sepolia.id] as Address;

    const sendTransaction = async ({
        to,
        value
    }: {
        to: Address;
        value: bigint;
    }) => {
        const generateCallData = (to: Address, value: bigint) => {
            const data = '0x';
            const callData = encodeFunctionData({
                abi: [
                    {
                        inputs: [
                            { name: 'dest', type: 'address' },
                            { name: 'value', type: 'uint256' },
                            { name: 'func', type: 'bytes' }
                        ],
                        name: 'execute',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function'
                    }
                ],
                args: [to, value, data]
            });

            return callData;
        };

        const callData = generateCallData(to, value);
        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];
        const { account: localAccount } = await getViemInstance();

        const gasPriceResult = await pimlicoBundler.getUserOperationGasPrice();

        const nonce = await getAccountNonce(viemPublicClient, {
            entryPoint,
            sender
        });

        const userOp = {
            sender: sender,
            nonce: nonce,
            initCode: '0x',
            callData,
            callGasLimit: 0n,
            verificationGasLimit: 0n,
            preVerificationGas: 0n,
            maxFeePerGas: gasPriceResult.fast.maxFeePerGas,
            maxPriorityFeePerGas: gasPriceResult.fast.maxPriorityFeePerGas,
            paymasterAndData: '0x',
            signature:
                '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c'
        } as UserOperation;

        const gasStimate = await pimlicoBundler.estimateUserOperationGas({
            userOperation: userOp,
            entryPoint
        });

        userOp.callGasLimit = gasStimate.callGasLimit;
        userOp.verificationGasLimit = gasStimate.verificationGasLimit;
        userOp.preVerificationGas = gasStimate.preVerificationGas;

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }

        const requiredPrefund = getRequiredPrefund({
            userOperation: userOp
        });

        console.log('Required prefund:', requiredPrefund);

        const senderBalance = await viemPublicClient.getBalance({
            address: sender
        });

        console.log('Sender balance:', senderBalance);

        if (senderBalance < requiredPrefund) {
            throw new Error(
                `Sender address does not have enough native tokens`
            );
        }

        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount,
            userOperation: userOp,
            chain: sepolia,
            entryPoint
        });

        userOp.signature = signature;

        const userOpHash = await pimlicoBundler.sendUserOperation({
            userOperation: userOp,
            entryPoint
        });

        console.log(`UserOperation submitted. Hash: ${userOpHash}`);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash: userOpHash
        });

        console.log(
            `Receipt found!\nTransaction hash: ${receipt.receipt.transactionHash}`
        );
    };

    const sponsoredTransaction = async ({
        to,
        value
    }: {
        to: Address;
        value: bigint;
    }) => {
        console.log('Sponsoring a user operation with the ERC-20 paymaster...');

        const generateCallData = (to: Address, value: bigint) => {
            const data = '0x';
            const callData = encodeFunctionData({
                abi: [
                    {
                        inputs: [
                            { name: 'dest', type: 'address' },
                            { name: 'value', type: 'uint256' },
                            { name: 'func', type: 'bytes' }
                        ],
                        name: 'execute',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function'
                    }
                ],
                args: [to, value, data]
            });

            return callData;
        };

        const { account: localAccount } = await getViemInstance();

        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];

        const newNonce = await getAccountNonce(viemPublicClient, {
            entryPoint,
            sender
        });

        const gasPriceResult = await pimlicoBundler.getUserOperationGasPrice();

        const sponsoredUserOperation: UserOperation = {
            sender,
            nonce: newNonce,
            initCode: '0x',
            callData: generateCallData(to, value),
            callGasLimit: 100753n, // hardcode it for now at a high value
            verificationGasLimit: 526674n, // hardcode it for now at a high value
            preVerificationGas: 47416n, // hardcode it for now at a high value
            maxFeePerGas: gasPriceResult.fast.maxFeePerGas,
            maxPriorityFeePerGas: gasPriceResult.fast.maxPriorityFeePerGas,
            paymasterAndData: ERC_20_PAYMASTER_ADDRESS, // to use the erc20 paymaster, put its address in the paymasterAndData field
            signature: '0x'
        };

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }

        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount!,
            userOperation: sponsoredUserOperation,
            chain: sepolia,
            entryPoint
        });

        console.log('UserOperation signature:', signature);

        sponsoredUserOperation.signature = signature;

        console.log('Sponsored user operation:', sponsoredUserOperation);

        await submitUserOperation(sponsoredUserOperation, entryPoint);
    };

    const submitUserOperation = async (
        userOperation: UserOperation,
        entryPoint: Address
    ) => {
        const userOperationHash = await pimlicoBundler.sendUserOperation({
            userOperation,
            entryPoint
        });

        console.log(`UserOperation submitted. Hash: ${userOperationHash}`);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash: userOperationHash
        });

        console.log(
            `Receipt found!\nTransaction hash: ${receipt.receipt.transactionHash}`
        );
    };

    const sendERC20Transaction = async ({
        to,
        value,
        tokenAddress
    }: {
        to: Address;
        value: bigint;
        tokenAddress: Address;
    }) => {
        const iface = new Interface(erc20abi);
        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];
        const { account: localAccount } = await getViemInstance();

        const callData = encodeFunctionData({
            abi: [
                {
                    inputs: [
                        { name: 'dest', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'func', type: 'bytes' }
                    ],
                    name: 'execute',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function'
                }
            ],
            args: [
                tokenAddress,
                0n, // 0 because it's not an ETH tx
                iface.encodeFunctionData('transfer', [to, value]) as Hex
            ]
        });

        let userOperation: UserOperation = (await buildUserOperation({
            sender,
            entryPoint,
            initCode: '0x',
            callData,
            bundlerClient: pimlicoBundler,
            publicClient: viemPublicClient
        })) as UserOperation;

        console.log('Built userOperation:', userOperation);
        const gasStimate = await pimlicoBundler.estimateUserOperationGas({
            userOperation: userOperation,
            entryPoint
        });

        userOperation.callGasLimit = gasStimate.callGasLimit;
        userOperation.verificationGasLimit = gasStimate.verificationGasLimit;
        userOperation.preVerificationGas = gasStimate.preVerificationGas;

        console.log('Sponsored userOperation:', userOperation);

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }

        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount,
            userOperation,
            entryPoint,
            chain: sepolia
        });
        userOperation = { ...userOperation, signature };
        console.log('Signed userOperation:', userOperation);

        // Send the useroperation
        const hash = await pimlicoBundler.sendUserOperation({
            userOperation,
            entryPoint
        });
        console.log('Sent userOperation:', hash);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash
        });
        const txHash = receipt.receipt.transactionHash;
        console.log(`Transaction hash: ${txHash}`);
    };

    const sponsoredERC20Transaction = async ({
        to,
        value,
        tokenAddress
    }: {
        to: Address;
        value: bigint;
        tokenAddress: Address;
    }) => {
        const iface = new Interface(erc20abi);
        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];
        const { account: localAccount } = await getViemInstance();

        const callData = encodeFunctionData({
            abi: [
                {
                    inputs: [
                        { name: 'dest', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'func', type: 'bytes' }
                    ],
                    name: 'execute',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function'
                }
            ],
            args: [
                tokenAddress,
                0n, // 0 because it's not an ETH tx
                iface.encodeFunctionData('transfer', [to, value]) as Hex
            ]
        });

        let userOperation: UserOperation = (await buildUserOperation({
            sender,
            entryPoint,
            initCode: '0x',
            callData,
            bundlerClient: pimlicoBundler,
            publicClient: viemPublicClient
        })) as UserOperation;

        console.log('Built userOperation:', userOperation);

        // Sponsor the useroperation
        const sponsorParams = await pimlicoPaymaster.sponsorUserOperation({
            userOperation,
            entryPoint
        });

        userOperation = { ...userOperation, ...sponsorParams };
        console.log('Sponsored userOperation:', userOperation);

        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount,
            userOperation,
            entryPoint,
            chain: sepolia
        });
        userOperation = { ...userOperation, signature };
        console.log('Signed userOperation:', userOperation);

        // Send the useroperation
        const hash = await pimlicoBundler.sendUserOperation({
            userOperation,
            entryPoint
        });
        console.log('Sent userOperation:', hash);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash
        });
        const txHash = receipt.receipt.transactionHash;
        console.log(`Transaction hash: ${txHash}`);
    };

    const sendAaveBatchTransactions = async ({
        txs
    }: {
        txs: EthereumTransactionTypeExtended[];
    }) => {
        const extendedTxs: transactionType[] = [];
        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];
        const { account: localAccount } = await getViemInstance();

        console.log({ txs });

        for (const tx of txs) {
            const txGas = await tx.gas();
            console.log('txGas', txGas);
            const extendedTxData = await tx.tx();
            extendedTxData.to;
            extendedTxs.push(extendedTxData);
        }

        const callData = encodeFunctionData({
            abi: simpleAccountABI,
            functionName: 'executeBatch',
            args: [
                extendedTxs.map((tx) => tx.to as Address),
                extendedTxs.map((tx) => tx.data as Address)
            ]
        });

        const userOperation: UserOperation = (await buildUserOperation({
            sender,
            entryPoint,
            initCode: '0x',
            callData,
            bundlerClient: pimlicoBundler,
            publicClient: viemPublicClient
        })) as UserOperation;

        console.log('Built userOperation:', userOperation);
        const gasStimate = await pimlicoBundler.estimateUserOperationGas({
            userOperation: userOperation,
            entryPoint
        });

        userOperation.callGasLimit = gasStimate.callGasLimit;
        userOperation.verificationGasLimit = gasStimate.verificationGasLimit;
        userOperation.preVerificationGas = gasStimate.preVerificationGas;

        console.log('Sponsored userOperation:', userOperation);

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }

        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount,
            userOperation,
            entryPoint,
            chain: sepolia
        });

        userOperation.signature = signature;
        console.log('Signed userOperation:', userOperation);

        // Send the useroperation
        const hash = await pimlicoBundler.sendUserOperation({
            userOperation,
            entryPoint
        });
        console.log('Sent userOperation:', hash);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash
        });
        const txHash = receipt.receipt.transactionHash;
        console.log(`Transaction hash: ${txHash}`);
    };

    const sendSponsoredERC20AaveBatchTransactions = async ({
        txs
    }: {
        txs: EthereumTransactionTypeExtended[];
    }) => {
        const extendedTxs: transactionType[] = [];
        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];
        const { account: localAccount } = await getViemInstance();

        for (const tx of txs) {
            const txGas = await tx.gas();
            console.log('txGas', txGas);
            const extendedTxData = await tx.tx();
            extendedTxData.to;
            extendedTxs.push(extendedTxData);
        }

        const callData = encodeFunctionData({
            abi: simpleAccountABI,
            functionName: 'executeBatch',
            args: [
                extendedTxs.map((tx) => tx.to as Address),
                extendedTxs.map((tx) => tx.data as Address)
            ]
        });

        let userOperation: UserOperation = (await buildUserOperation({
            sender,
            entryPoint,
            initCode: '0x',
            callData,
            bundlerClient: pimlicoBundler,
            publicClient: viemPublicClient
        })) as UserOperation;

        console.log('Built userOperation:', userOperation);

        const sponsorParams = await pimlicoPaymaster.sponsorUserOperation({
            userOperation,
            entryPoint
        });

        userOperation = { ...userOperation, ...sponsorParams };

        console.log('Sponsored userOperation:', userOperation);

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }

        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount,
            userOperation,
            entryPoint,
            chain: sepolia
        });

        userOperation.signature = signature;
        console.log('Signed userOperation:', userOperation);

        // Send the useroperation
        const hash = await pimlicoBundler.sendUserOperation({
            userOperation,
            entryPoint
        });
        console.log('Sent userOperation:', hash);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash
        });
        const txHash = receipt.receipt.transactionHash;
        console.log(`Transaction hash: ${txHash}`);
    };

    /**
     * Send a CCIP transfer.  This is a transfer of a token from one chain to another.
     * The token must be a CCIP token (https://docs.chain.link/ccip/supported-networks/v1_2_0/testnet)
     *
     * @note This is a sponsored transaction, so the user does not need to pay gas fees.
     *
     * @param param0 - sourceChain, destinationChain, destinationAccount, tokenToTransfer, amount
     */
    const sendCCIPtransferSponsored = async ({
        sourceChain,
        destinationChain,
        destinationAccount,
        tokenToTransfer,
        amount
    }: {
        sourceChain: string;
        destinationChain: string;
        destinationAccount: Address;
        tokenToTransfer: Address;
        amount: bigint;
    }) => {
        const entryPoint = (await pimlicoBundler.supportedEntryPoints())?.[0];
        const { account: localAccount } = await getViemInstance();

        // Create a contract instance for the router using its ABI and address
        const sourceRouter = new ethers.Contract(
            CCIP.getRouterConfig(sourceChain).address,
            CCIP.RouterABI,
            ethersProvider
        );

        // Get the chain selector for the target chain
        const destinationChainSelector =
            CCIP.getRouterConfig(destinationChain).chainSelector;

        // build message
        const tokenAmounts = [
            {
                token: tokenToTransfer,
                amount: amount
            }
        ];

        // Encoding the data

        const functionSelector = ethers.utils
            .id('CCIP EVMExtraArgsV1')
            .slice(0, 10);

        //  "extraArgs" is a structure that can be represented as [ 'uint256']
        // extraArgs are { gasLimit: 0 }
        // we set gasLimit specifically to 0 because we are not sending any data so we are not expecting a receiving contract to handle data

        const extraArgs = ethers.utils.defaultAbiCoder.encode(['uint256'], [0]);

        const encodedExtraArgs = functionSelector + extraArgs.slice(2);

        const message = {
            receiver: ethers.utils.defaultAbiCoder.encode(
                ['address'],
                [destinationAccount]
            ),
            data: '0x', // no data
            tokenAmounts: tokenAmounts,
            feeToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // This is the address of LINK. Check fee tokens: https://docs.chain.link/ccip/supported-networks/v1_2_0/testnet#arbitrum-sepolia-ethereum-sepolia
            extraArgs: encodedExtraArgs
        };

        const fees = await sourceRouter.getFee(
            destinationChainSelector,
            message
        );
        console.log(`Estimated fees (wei): ${fees}`);

        const erc20Iface = new ethers.utils.Interface(erc20abi);

        const approvalData = erc20Iface.encodeFunctionData('approve', [
            destinationAccount,
            fees
        ]) as Hex;

        const routerIface = new ethers.utils.Interface(CCIP.RouterABI);

        const ccipSendData = routerIface.encodeFunctionData('ccipSend', [
            destinationChainSelector,
            message
        ]) as Hex;

        const callData = encodeFunctionData({
            abi: simpleAccountABI,
            functionName: 'executeBatch',
            args: [
                [
                    "0x779877A7B0D9E8603169DdbD7836e478b4624789", // LINK address
                    CCIP.getRouterConfig(sourceChain).address as Hex
                ],
                [approvalData, ccipSendData]
            ]
        });

        const userOperation: UserOperation = (await buildUserOperation({
            sender,
            entryPoint,
            initCode: '0x',
            callData,
            bundlerClient: pimlicoBundler,
            publicClient: viemPublicClient
        })) as UserOperation;

        console.log('Built userOperation:', userOperation);
        const gasStimate = await pimlicoBundler.estimateUserOperationGas({
            userOperation: userOperation,
            entryPoint
        });

        userOperation.callGasLimit = gasStimate.callGasLimit;
        userOperation.verificationGasLimit = gasStimate.verificationGasLimit;
        userOperation.preVerificationGas = gasStimate.preVerificationGas;

        console.log('Sponsored userOperation:', userOperation);

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }


        const signature = await signUserOperationWithPasskey({
            viemAccount: localAccount,
            userOperation,
            entryPoint,
            chain: sepolia
        });

        userOperation.signature = signature;
        console.log('Signed userOperation:', userOperation);

        // Send the useroperation
        const hash = await pimlicoBundler.sendUserOperation({
            userOperation,
            entryPoint
        });
        console.log('Sent userOperation:', hash);

        console.log('Querying for receipts...');
        const receipt = await pimlicoBundler.waitForUserOperationReceipt({
            hash
        });
        const txHash = receipt.receipt.transactionHash;
        console.log(`Transaction hash: ${txHash}`);
    };

    return {
        sendTransaction,
        sponsoredTransaction,
        sendERC20Transaction,
        sponsoredERC20Transaction,
        sendAaveBatchTransactions,
        sendSponsoredERC20AaveBatchTransactions,
        sendCCIPtransferSponsored
    };
};
