import { Address, encodeFunctionData } from 'viem';
import { useCounterFactualAddress, useLfghoClients } from '..';
import {
    UserOperation,
    getAccountNonce,
    getRequiredPrefund
} from 'permissionless';
import { sepolia } from 'viem/chains';
import { signUserOperationWithPasskey } from '../_pimlico';

export const useTransaction = () => {
    const { pimlicoBundler, viemPublicClient, getViemInstance } =
        useLfghoClients();
    const { addressRecords } = useCounterFactualAddress();
    const sender = addressRecords?.[sepolia.id] as Address;

    const sendTransaction = async ({
        to,
        value
    }: {
        to: Address;
        value: bigint;
    }) => {
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

    return { sendTransaction };
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
