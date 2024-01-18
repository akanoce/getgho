import {
    PimlicoBundlerClient,
    PimlicoPaymasterClient
} from 'permissionless/clients/pimlico';
import { Address, Hex, LocalAccount, PublicClient, encodeFunctionData } from 'viem';
import { buildUserOperation } from './buildUserOperation';
import { UserOperation } from 'permissionless';
import { signUserOperationWithPasskey } from '.';
import { sepolia } from 'viem/chains';
import { type Interface } from 'ethers/lib/utils';

export const sendTransactionWithSponsor = async (
    contractAddress: Address,
    contractInterface: Interface,
    contractMethod: string,
    contractMethodArgs: unknown[],
    txValue: bigint,
    smartAccountAddress: Address,
    bundlerClient: PimlicoBundlerClient,
    paymasterClient: PimlicoPaymasterClient,
    publicClient: PublicClient,
    passkeyAccount: LocalAccount,
    entrypointAddress: Address,
) => {
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
            contractAddress,
            txValue,
            contractInterface.encodeFunctionData(contractMethod, contractMethodArgs) as Hex
        ]
    });

    let userOperation: UserOperation = (await buildUserOperation({
        sender: smartAccountAddress,
        entryPoint: entrypointAddress,
        initCode: "0x",
        callData,
        bundlerClient,
        publicClient
    })) as UserOperation;

    console.log('Built userOperation:', userOperation);

    // Sponsor the useroperation
    const sponsorParams = await paymasterClient.sponsorUserOperation({
        userOperation,
        entryPoint: entrypointAddress
    });

    userOperation = { ...userOperation, ...sponsorParams };
    console.log('Sponsored userOperation:', userOperation);

    const signature = await signUserOperationWithPasskey({
        viemAccount: passkeyAccount,
        userOperation,
        entryPoint: entrypointAddress,
        chain: sepolia
    });
    userOperation = { ...userOperation, signature };
    console.log('Signed userOperation:', userOperation);

    // Send the useroperation
    const hash = await bundlerClient.sendUserOperation({
        userOperation,
        entryPoint: entrypointAddress
    });
    console.log('Sent userOperation:', hash);

    console.log('Querying for receipts...');
    const receipt =
        await bundlerClient.waitForUserOperationReceipt({ hash });
    const txHash = receipt.receipt.transactionHash;
    console.log(`Transaction hash: ${txHash}`);
};
