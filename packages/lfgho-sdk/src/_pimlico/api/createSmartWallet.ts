import { Address, LocalAccount, PublicClient } from 'viem';
import { buildUserOperation } from './buildUserOperation';
import {
    PimlicoBundlerClient,
    PimlicoPaymasterClient
} from 'permissionless/clients/pimlico';
import { UserOperation } from 'permissionless';
import { signUserOperationWithPasskey } from './signUserOperationWithPasskey';
import { sepolia } from 'viem/chains';
import { approveERC20Paymaster } from '.';
import { WalletCreationStep } from '../..';

export const createSmartWallet = async ({
    viemAccount,
    sender,
    entryPoint,
    viemPublicClient,
    pimlicoBundler,
    initCode,
    pimlicoPaymaster,
    setWalletCreationStep
}: {
    viemAccount: LocalAccount;
    sender: Address;
    entryPoint: Address;
    viemPublicClient: PublicClient;
    pimlicoBundler: PimlicoBundlerClient;
    initCode: Address;
    pimlicoPaymaster: PimlicoPaymasterClient;
    setWalletCreationStep: (walletCreationStep: WalletCreationStep) => void;
}) => {
    try {
        // create mock call data
        const callData = approveERC20Paymaster();

        console.log(
            'Generated domain registration & set-address batch callData:',
            callData
        );

        // Build useroperation
        // pseudo-transaction objects that are used to execute transactions with contract accounts. They contain information such as nonce, gas limit, gas price, initCode or target, data, signature, etc.
        let userOperation = (await buildUserOperation({
            sender,
            entryPoint,
            callData,
            bundlerClient: pimlicoBundler,
            publicClient: viemPublicClient,
            initCode
        })) as UserOperation;

        console.log('Built userOperation:', userOperation);

        // Sponsor the useroperation
        const sponsorParams = await pimlicoPaymaster.sponsorUserOperation({
            userOperation,
            entryPoint
        });

        console.log('Got sponsorParams:', sponsorParams);

        userOperation = {
            ...userOperation,
            ...sponsorParams,
            preVerificationGas: sponsorParams.preVerificationGas,
            verificationGasLimit: sponsorParams.verificationGasLimit,
            callGasLimit: sponsorParams.callGasLimit,
            paymasterAndData: sponsorParams.paymasterAndData
        };

        console.log('Sponsored userOperation:', userOperation);

        setWalletCreationStep(WalletCreationStep.RequestingSignature);

        // Sign the useroperation

        const signature = await signUserOperationWithPasskey({
            viemAccount,
            userOperation,
            chain: sepolia,
            entryPoint
        });

        setWalletCreationStep(WalletCreationStep.DeployingWallet);

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

        console.log(
            `Transaction hash: https://sepolia.etherscan.io/tx/${txHash}`
        );
    } catch (error) {
        console.error(error);
    }
};
