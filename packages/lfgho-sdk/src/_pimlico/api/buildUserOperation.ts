import { UserOperation, getAccountNonce } from 'permissionless';
import { PimlicoBundlerClient } from 'permissionless/clients/pimlico';
import { Hex, PublicClient } from 'viem';

type BuildUserOperationParams = {
    sender: Hex;
    entryPoint: Hex;
    initCode: Hex;
    callData: Hex;
    bundlerClient: PimlicoBundlerClient;
    publicClient: PublicClient;
} & Partial<UserOperation>;

export const buildUserOperation = async ({
    sender,
    entryPoint,
    initCode,
    callData,
    bundlerClient,
    publicClient,
    ...rest
}: BuildUserOperationParams) => {
    const gasPriceResult = await bundlerClient.getUserOperationGasPrice();
    const nonce = await getAccountNonce(publicClient, { entryPoint, sender });

    if (nonce !== 0n) {
        console.log(
            'Deployment UserOperation previously submitted, skipping...'
        );

        return;
    }

    const userOperation: Partial<UserOperation> = {
        sender,
        nonce,
        initCode,
        callData,
        paymasterAndData: '0x',
        maxFeePerGas: gasPriceResult.fast.maxFeePerGas,
        maxPriorityFeePerGas: gasPriceResult.fast.maxPriorityFeePerGas,
        signature:
            '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
        ...rest
    };

    return userOperation;
};
