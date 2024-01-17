import { encodeFunctionData } from 'viem';
import { ERC_20_PAYMASTER_ADDRESS, USDC_SEPOLIA_ADDRESS } from '../const';

export const approveERC20Paymaster = () => {
    const approveData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: '_spender', type: 'address' },
                    { name: '_value', type: 'uint256' }
                ],
                name: 'approve',
                outputs: [{ name: '', type: 'bool' }],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ],
        args: [
            ERC_20_PAYMASTER_ADDRESS,
            0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
        ]
    });

    // GENERATE THE CALLDATA TO APPROVE THE USDC
    const to = USDC_SEPOLIA_ADDRESS;
    const value = 0n;
    const data = approveData;

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
