import {
    UserOperation,
    getAccountNonce,
    getUserOperationHash
} from 'permissionless';
import { Address, encodeFunctionData } from 'viem';
import { useLfghoClients } from '.';
import { useCounterFactualAddress } from '..';
import { sepolia } from 'viem/chains';
import { ERC_20_PAYMASTER_ADDRESS } from '../_pimlico';

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

export const useSponsoredTransaction = () => {
    const { viemPublicClient, pimlicoBundler, getViemInstance } =
        useLfghoClients();
    const { addressRecords } = useCounterFactualAddress();
    const sender = addressRecords?.[sepolia.id] as Address;

    const sponsoredTransaction = async ({
        to,
        value
    }: {
        to: Address;
        value: bigint;
    }) => {
        console.log('Sponsoring a user operation with the ERC-20 paymaster...');

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

        // SIGN THE USEROPERATION
        // const signature = await signUserOperationWithPasskey({
        //     viemAccount: localAccount!,
        //     userOperation: sponsoredUserOperation,
        //     chain: sepolia,
        //     entryPoint
        // });

        const userOperationHash = getUserOperationHash({
            userOperation: sponsoredUserOperation,
            chainId: sepolia.id,
            entryPoint
        });

        console.log('UserOperation hash:', userOperationHash);

        if (!localAccount) {
            throw new Error('No local account found');
        }

        if (!localAccount.signMessage) {
            throw new Error('No signMessage method found on local account');
        }

        const signature = await localAccount.signMessage({
            message: {
                raw: userOperationHash
            }
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

    return { sponsoredTransaction };
};
