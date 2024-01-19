import { Address, Hex, encodeFunctionData } from 'viem';
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
import { erc20abi } from '../_pimlico/util';

export const useTransactions = () => {
    const {
        pimlicoBundler,
        viemPublicClient,
        getViemInstance,
        pimlicoPaymaster
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
        const genereteCallData = (to: Address, value: bigint) => {
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

        const callData = genereteCallData(to, value);
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

    return { sendTransaction, sponsoredTransaction, sponsoredERC20Transaction };
};
