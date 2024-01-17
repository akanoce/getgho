import { UserOperation, getUserOperationHash } from 'permissionless';
import { Chain, Hex, LocalAccount } from 'viem';

export const signUserOperationWithPasskey = async ({
    viemAccount,
    userOperation,
    entryPoint,
    chain
}: {
    viemAccount: LocalAccount;
    userOperation: UserOperation;
    entryPoint: Hex;
    chain: Chain;
}) => {
    const userOperationHash = getUserOperationHash({
        userOperation,
        chainId: chain.id,
        entryPoint
    });

    const signature = await viemAccount.signMessage({
        message: {
            raw: userOperationHash
        }
    });

    return signature;
};
