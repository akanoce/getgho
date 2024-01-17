import {
    UserOperation,
    getAccountNonce,
    getUserOperationHash
} from 'permissionless';
import { Address, encodeFunctionData } from 'viem';
import { useLfghoClients, useTurnkeyViem } from '.';
import { useCounterFactualAddress } from '..';
import { sepolia } from 'viem/chains';
import { ERC_20_PAYMASTER_ADDRESS } from '../_pimlico';

export const useSponsoredTransaction = () => {
    const { viemPublicClient, pimlicoBundler, viemSigner } = useLfghoClients();
    const { getViemInstance } = useTurnkeyViem();
    const { addressRecords } = useCounterFactualAddress();
    const sender = addressRecords?.[sepolia.id] as Address;

    viemSigner?.account;

    const sponsoredTransaction = async ({
        to,
        value
    }: {
        to: Address;
        value: bigint;
    }) => {
        console.log('Sponsoring a user operation with the ERC-20 paymaster...');

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
            callData: genereteCallData(to, value),
            callGasLimit: 100_000n, // TODO - hardcode it for now at a high value
            verificationGasLimit: 500_000n, // TODO - hardcode it for now at a high value
            preVerificationGas: 50_000n, // TODO - hardcode it for now at a high value
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

        //TODO: correct?
        const localAccount = await (await getViemInstance()).account;

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

        sponsoredUserOperation.signature = signature;

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
