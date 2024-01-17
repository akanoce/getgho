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

    if (nonce !== 0n)
        console.log(
            'Deployment UserOperation previously submitted, skipping...'
        );

    const userOperation: Partial<UserOperation> = {
        sender,
        nonce,
        initCode,
        callData,
        paymasterAndData: '0x',
        preVerificationGas: 61230n, // TypeError: Cannot convert undefined to a BigInt
        verificationGasLimit: 93823n, // TypeError: Cannot convert undefined to a BigInt
        callGasLimit: 134849n, // TypeError: Cannot convert undefined to a BigInt
        maxFeePerGas: gasPriceResult.fast.maxFeePerGas,
        maxPriorityFeePerGas: gasPriceResult.fast.maxPriorityFeePerGas,
        signature:
            '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
        ...rest
    };

    return userOperation;
};

//

const _ = {
    method: 'pm_sponsorUserOperation',
    params: [
        {
            sender: '0x9eC2CB630Bb93DF4f451C66AFD9f767c1c5d51ea',
            nonce: '0x0',
            initCode:
                '0x9406Cc6185a346906296840746125a0E449764545fbfb9cf000000000000000000000000b9b249a1c4575f083734e2f0245a5e8dbb5708f50000000000000000000000000000000000000000000000000000000000000000',
            callData:
                '0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000',
            paymasterAndData: '0x',
            maxFeePerGas: '0x327cd2cfe',
            maxPriorityFeePerGas: '0x327cd2cfe',
            signature:
                '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c'
        },
        '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'
    ]
};
