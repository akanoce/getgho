//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EACAggregatorProxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 */
export const eacAggregatorProxyABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_aggregator', internalType: 'address', type: 'address' },
      { name: '_accessController', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'current', internalType: 'int256', type: 'int256', indexed: true },
      { name: 'roundId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AnswerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roundId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'startedBy', internalType: 'address', type: 'address', indexed: true },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'NewRound',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'accessController',
    outputs: [{ name: '', internalType: 'contract AccessControllerInterface', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'aggregator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_aggregator', internalType: 'address', type: 'address' }],
    name: 'confirmAggregator',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'description',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAnswer',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint80', type: 'uint80' }],
    name: 'getRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'latestRound',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'latestTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    name: 'phaseAggregators',
    outputs: [{ name: '', internalType: 'contract AggregatorV2V3Interface', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'phaseId',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_aggregator', internalType: 'address', type: 'address' }],
    name: 'proposeAggregator',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposedAggregator',
    outputs: [{ name: '', internalType: 'contract AggregatorV2V3Interface', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_roundId', internalType: 'uint80', type: 'uint80' }],
    name: 'proposedGetRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proposedLatestRoundData',
    outputs: [
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
      { name: 'startedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'updatedAt', internalType: 'uint256', type: 'uint256' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_accessController', internalType: 'address', type: 'address' }],
    name: 'setController',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_to', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 */
export const eacAggregatorProxyAddress = {
  1: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
 */
export const eacAggregatorProxyConfig = {
  address: eacAggregatorProxyAddress,
  abi: eacAggregatorProxyABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ENSRegistryCCIP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0x26c3B74EF154805F678376cC7e082622D313f4CF)
 */
export const ensRegistryCcipABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: '_router', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'message',
        internalType: 'struct Client.Any2EVMMessage',
        type: 'tuple',
        components: [
          { name: 'messageId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
          { name: 'sender', internalType: 'bytes', type: 'bytes' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'destTokenAmounts',
            internalType: 'struct Client.EVMTokenAmount[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'ccipReceive',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '_sourceChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: 'sender', internalType: 'address', type: 'address' },
    ],
    name: 'isCCIPWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'recordExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'setOwner',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
      { name: 'ttl', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setRecord',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'resolver', internalType: 'address', type: 'address' },
    ],
    name: 'setResolver',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'label', internalType: 'bytes32', type: 'bytes32' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'setSubnodeOwner',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'label', internalType: 'bytes32', type: 'bytes32' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
      { name: 'ttl', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setSubnodeRecord',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'ttl', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setTTL',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ttl',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'label', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'resolver', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewResolver',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'ttl', internalType: 'uint64', type: 'uint64', indexed: false },
    ],
    name: 'NewTTL',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [{ name: 'router', internalType: 'address', type: 'address' }],
    name: 'InvalidRouter',
  },
] as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0x26c3B74EF154805F678376cC7e082622D313f4CF)
 */
export const ensRegistryCcipAddress = {
  43113: '0x26c3B74EF154805F678376cC7e082622D313f4CF',
} as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0x26c3B74EF154805F678376cC7e082622D313f4CF)
 */
export const ensRegistryCcipConfig = {
  address: ensRegistryCcipAddress,
  abi: ensRegistryCcipABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EntryPoint
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)
 */
export const entryPointABI = [
  {
    type: 'error',
    inputs: [
      { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
      { name: 'paid', internalType: 'uint256', type: 'uint256' },
      { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
      { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
      { name: 'targetSuccess', internalType: 'bool', type: 'bool' },
      { name: 'targetResult', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'ExecutionResult',
  },
  {
    type: 'error',
    inputs: [
      { name: 'opIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'FailedOp',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'SenderAddressResult',
  },
  {
    type: 'error',
    inputs: [{ name: 'aggregator', internalType: 'address', type: 'address' }],
    name: 'SignatureValidationFailed',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'returnInfo',
        internalType: 'struct IEntryPoint.ReturnInfo',
        type: 'tuple',
        components: [
          { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
          { name: 'prefund', internalType: 'uint256', type: 'uint256' },
          { name: 'sigFailed', internalType: 'bool', type: 'bool' },
          { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
          { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
          { name: 'paymasterContext', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'senderInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'factoryInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'paymasterInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'ValidationResult',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'returnInfo',
        internalType: 'struct IEntryPoint.ReturnInfo',
        type: 'tuple',
        components: [
          { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
          { name: 'prefund', internalType: 'uint256', type: 'uint256' },
          { name: 'sigFailed', internalType: 'bool', type: 'bool' },
          { name: 'validAfter', internalType: 'uint48', type: 'uint48' },
          { name: 'validUntil', internalType: 'uint48', type: 'uint48' },
          { name: 'paymasterContext', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'senderInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'factoryInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'paymasterInfo',
        internalType: 'struct IStakeManager.StakeInfo',
        type: 'tuple',
        components: [
          { name: 'stake', internalType: 'uint256', type: 'uint256' },
          { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'aggregatorInfo',
        internalType: 'struct IEntryPoint.AggregatorStakeInfo',
        type: 'tuple',
        components: [
          { name: 'aggregator', internalType: 'address', type: 'address' },
          {
            name: 'stakeInfo',
            internalType: 'struct IStakeManager.StakeInfo',
            type: 'tuple',
            components: [
              { name: 'stake', internalType: 'uint256', type: 'uint256' },
              { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'ValidationResultWithAggregation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'factory', internalType: 'address', type: 'address', indexed: false },
      { name: 'paymaster', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AccountDeployed',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'BeforeExecution' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'totalDeposit', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'aggregator', internalType: 'address', type: 'address', indexed: true }],
    name: 'SignatureAggregatorChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'totalStaked', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'unstakeDelaySec', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'StakeLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'withdrawTime', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'StakeUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'withdrawAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'StakeWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'paymaster', internalType: 'address', type: 'address', indexed: true },
      { name: 'nonce', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
      { name: 'actualGasCost', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'actualGasUsed', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'UserOperationEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'nonce', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'revertReason', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'UserOperationRevertReason',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'withdrawAddress', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Withdrawn',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'SIG_VALIDATION_FAILED',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'initCode', internalType: 'bytes', type: 'bytes' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
    ],
    name: '_validateSenderAndPaymaster',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' }],
    name: 'addStake',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'depositTo',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'deposits',
    outputs: [
      { name: 'deposit', internalType: 'uint112', type: 'uint112' },
      { name: 'staked', internalType: 'bool', type: 'bool' },
      { name: 'stake', internalType: 'uint112', type: 'uint112' },
      { name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
      { name: 'withdrawTime', internalType: 'uint48', type: 'uint48' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getDepositInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct IStakeManager.DepositInfo',
        type: 'tuple',
        components: [
          { name: 'deposit', internalType: 'uint112', type: 'uint112' },
          { name: 'staked', internalType: 'bool', type: 'bool' },
          { name: 'stake', internalType: 'uint112', type: 'uint112' },
          { name: 'unstakeDelaySec', internalType: 'uint32', type: 'uint32' },
          { name: 'withdrawTime', internalType: 'uint48', type: 'uint48' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'key', internalType: 'uint192', type: 'uint192' },
    ],
    name: 'getNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'initCode', internalType: 'bytes', type: 'bytes' }],
    name: 'getSenderAddress',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'getUserOpHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'opsPerAggregator',
        internalType: 'struct IEntryPoint.UserOpsPerAggregator[]',
        type: 'tuple[]',
        components: [
          {
            name: 'userOps',
            internalType: 'struct UserOperation[]',
            type: 'tuple[]',
            components: [
              { name: 'sender', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'uint256', type: 'uint256' },
              { name: 'initCode', internalType: 'bytes', type: 'bytes' },
              { name: 'callData', internalType: 'bytes', type: 'bytes' },
              { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
              { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
              { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
              { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
              { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
              { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
              { name: 'signature', internalType: 'bytes', type: 'bytes' },
            ],
          },
          { name: 'aggregator', internalType: 'contract IAggregator', type: 'address' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'beneficiary', internalType: 'address payable', type: 'address' },
    ],
    name: 'handleAggregatedOps',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'ops',
        internalType: 'struct UserOperation[]',
        type: 'tuple[]',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'beneficiary', internalType: 'address payable', type: 'address' },
    ],
    name: 'handleOps',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'key', internalType: 'uint192', type: 'uint192' }],
    name: 'incrementNonce',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'callData', internalType: 'bytes', type: 'bytes' },
      {
        name: 'opInfo',
        internalType: 'struct EntryPoint.UserOpInfo',
        type: 'tuple',
        components: [
          {
            name: 'mUserOp',
            internalType: 'struct EntryPoint.MemoryUserOp',
            type: 'tuple',
            components: [
              { name: 'sender', internalType: 'address', type: 'address' },
              { name: 'nonce', internalType: 'uint256', type: 'uint256' },
              { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
              { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
              { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
              { name: 'paymaster', internalType: 'address', type: 'address' },
              { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
              { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'prefund', internalType: 'uint256', type: 'uint256' },
          { name: 'contextOffset', internalType: 'uint256', type: 'uint256' },
          { name: 'preOpGas', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'context', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'innerHandleOp',
    outputs: [{ name: 'actualGasCost', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint192', type: 'uint192' },
    ],
    name: 'nonceSequenceNumber',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'op',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'targetCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'simulateHandleOp',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'simulateValidation',
    outputs: [],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'unlockStake', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'withdrawAddress', internalType: 'address payable', type: 'address' }],
    name: 'withdrawStake',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'withdrawAddress', internalType: 'address payable', type: 'address' },
      { name: 'withdrawAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)
 */
export const entryPointAddress = {
  11155111: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789)
 */
export const entryPointConfig = { address: entryPointAddress, abi: entryPointABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FIFSRegistrarCCIP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0x745f416b9c8883fdD8869e652b3Ea29dbD3ec7bc)
 */
export const fifsRegistrarCcipABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'ensAddr', internalType: 'contract ENS', type: 'address' },
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_router', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'message',
        internalType: 'struct Client.Any2EVMMessage',
        type: 'tuple',
        components: [
          { name: 'messageId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
          { name: 'sender', internalType: 'bytes', type: 'bytes' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'destTokenAmounts',
            internalType: 'struct Client.EVMTokenAmount[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'ccipReceive',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: 'sender', internalType: 'address', type: 'address' },
    ],
    name: 'isCCIPWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'label', internalType: 'bytes32', type: 'bytes32' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'register',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    type: 'error',
    inputs: [{ name: 'router', internalType: 'address', type: 'address' }],
    name: 'InvalidRouter',
  },
] as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0x745f416b9c8883fdD8869e652b3Ea29dbD3ec7bc)
 */
export const fifsRegistrarCcipAddress = {
  43113: '0x745f416b9c8883fdD8869e652b3Ea29dbD3ec7bc',
} as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0x745f416b9c8883fdD8869e652b3Ea29dbD3ec7bc)
 */
export const fifsRegistrarCcipConfig = {
  address: fifsRegistrarCcipAddress,
  abi: fifsRegistrarCcipABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PublicResolverCCIP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xf425867c6E64cf5bD2f9CaA9918A21E8073E7995)
 */
export const publicResolverCcipABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'coinType', internalType: 'uint256', type: 'uint256' },
      { name: 'ensAddr', internalType: 'contract ENS', type: 'address' },
      { name: 'trustedController', internalType: 'address', type: 'address' },
      { name: 'trustedReverseRegistrar', internalType: 'address', type: 'address' },
      { name: 'router', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'addr',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'coinType', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addr',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'delegate', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'message',
        internalType: 'struct Client.Any2EVMMessage',
        type: 'tuple',
        components: [
          { name: 'messageId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
          { name: 'sender', internalType: 'bytes', type: 'bytes' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'destTokenAmounts',
            internalType: 'struct Client.EVMTokenAmount[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'ccipReceive',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'clearRecords',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'interfaceID', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'interfaceImplementer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'delegate', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedFor',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: 'sender', internalType: 'address', type: 'address' },
    ],
    name: 'isCCIPWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'nodehash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'data', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'multicallWithNodeCheck',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'recordVersions',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'coinType', internalType: 'uint256', type: 'uint256' },
      { name: 'a', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setAddr',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'a', internalType: 'address', type: 'address' },
    ],
    name: 'setAddr',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'interfaceID', internalType: 'bytes4', type: 'bytes4' },
      { name: 'implementer', internalType: 'address', type: 'address' },
    ],
    name: 'setInterface',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newName', internalType: 'string', type: 'string' },
    ],
    name: 'setName',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'a', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AddrChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'coinType', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newAddress', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'AddressChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'delegate', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: true },
    ],
    name: 'Approved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'interfaceID', internalType: 'bytes4', type: 'bytes4', indexed: true },
      { name: 'implementer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'InterfaceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'NameChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'newVersion', internalType: 'uint64', type: 'uint64', indexed: false },
    ],
    name: 'VersionChanged',
  },
  {
    type: 'error',
    inputs: [{ name: 'router', internalType: 'address', type: 'address' }],
    name: 'InvalidRouter',
  },
] as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xf425867c6E64cf5bD2f9CaA9918A21E8073E7995)
 */
export const publicResolverCcipAddress = {
  43113: '0xf425867c6E64cf5bD2f9CaA9918A21E8073E7995',
} as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xf425867c6E64cf5bD2f9CaA9918A21E8073E7995)
 */
export const publicResolverCcipConfig = {
  address: publicResolverCcipAddress,
  abi: publicResolverCcipABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReverseRegistrarCCIP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xdf0586C41617Db9886b54E36c649B0D2980F330c)
 */
export const reverseRegistrarCcipABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'ensAddr', internalType: 'contract ENS', type: 'address' },
      { name: '_router', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'message',
        internalType: 'struct Client.Any2EVMMessage',
        type: 'tuple',
        components: [
          { name: 'messageId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
          { name: 'sender', internalType: 'bytes', type: 'bytes' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'destTokenAmounts',
            internalType: 'struct Client.EVMTokenAmount[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'ccipReceive',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
    ],
    name: 'claimForAddr',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
    ],
    name: 'claimWithResolver',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'controllers',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'defaultResolver',
    outputs: [{ name: '', internalType: 'contract NameResolver', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'ens',
    outputs: [{ name: '', internalType: 'contract ENS', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: 'sender', internalType: 'address', type: 'address' },
    ],
    name: 'isCCIPWhitelisted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'node',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'controller', internalType: 'address', type: 'address' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setController',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'resolver', internalType: 'address', type: 'address' }],
    name: 'setDefaultResolver',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'setName',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
      { name: 'name', internalType: 'string', type: 'string' },
    ],
    name: 'setNameForAddr',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'controller', internalType: 'address', type: 'address', indexed: true },
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ControllerChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'resolver', internalType: 'contract NameResolver', type: 'address', indexed: true },
    ],
    name: 'DefaultResolverChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address', indexed: true },
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'ReverseClaimed',
  },
  {
    type: 'error',
    inputs: [{ name: 'router', internalType: 'address', type: 'address' }],
    name: 'InvalidRouter',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xdf0586C41617Db9886b54E36c649B0D2980F330c)
 */
export const reverseRegistrarCcipAddress = {
  43113: '0xdf0586C41617Db9886b54E36c649B0D2980F330c',
} as const

/**
 * [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xdf0586C41617Db9886b54E36c649B0D2980F330c)
 */
export const reverseRegistrarCcipConfig = {
  address: reverseRegistrarCcipAddress,
  abi: reverseRegistrarCcipABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleAccount
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x8ABB13360b87Be5EEb1B98647A016adD927a136c)
 */
export const simpleAccountABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: 'anEntryPoint', internalType: 'contract IEntryPoint', type: 'address' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'entryPoint', internalType: 'contract IEntryPoint', type: 'address', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'SimpleAccountInitialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address', indexed: true }],
    name: 'Upgraded',
  },
  { stateMutability: 'payable', type: 'function', inputs: [], name: 'addDeposit', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'entryPoint',
    outputs: [{ name: '', internalType: 'contract IEntryPoint', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'dest', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'func', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'dest', internalType: 'address[]', type: 'address[]' },
      { name: 'func', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'executeBatch',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'anOwner', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'tokensReceived',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'missingAccountFunds', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateUserOp',
    outputs: [{ name: 'validationData', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'withdrawAddress', internalType: 'address payable', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawDepositTo',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x8ABB13360b87Be5EEb1B98647A016adD927a136c)
 */
export const simpleAccountAddress = {
  11155111: '0x8ABB13360b87Be5EEb1B98647A016adD927a136c',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x8ABB13360b87Be5EEb1B98647A016adD927a136c)
 */
export const simpleAccountConfig = { address: simpleAccountAddress, abi: simpleAccountABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SimpleAccountFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9406Cc6185a346906296840746125a0E44976454)
 */
export const simpleAccountFactoryABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: '_entryPoint', internalType: 'contract IEntryPoint', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'accountImplementation',
    outputs: [{ name: '', internalType: 'contract SimpleAccount', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createAccount',
    outputs: [{ name: 'ret', internalType: 'contract SimpleAccount', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9406Cc6185a346906296840746125a0E44976454)
 */
export const simpleAccountFactoryAddress = {
  11155111: '0x9406Cc6185a346906296840746125a0E44976454',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x9406Cc6185a346906296840746125a0E44976454)
 */
export const simpleAccountFactoryConfig = {
  address: simpleAccountFactoryAddress,
  abi: simpleAccountFactoryABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xcENSRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0xa3712828a74A413E9538d5eBd6B1eB50446f8287)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x8bb2985caaEf7a336086eeFe3FbD699dfF81d18A)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x65057a6821CC4B4bF848e40789629ebF8879bbce)
 */
export const xcEnsRegistryABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_router', internalType: 'address', type: 'address' },
      { name: '_destinationChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: '_receiverAddress', internalType: 'address', type: 'address' },
      { name: '_feeToken', internalType: 'address', type: 'address' },
    ],
  },
  { stateMutability: 'payable', type: 'receive' },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'destinationChainSelector',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'receiverAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'recordExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'router',
    outputs: [{ name: '', internalType: 'contract IRouterClient', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'setOwner',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_resolver', internalType: 'address', type: 'address' },
      { name: '_ttl', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setRecord',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_resolver', internalType: 'address', type: 'address' },
    ],
    name: 'setResolver',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_label', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'setSubnodeOwner',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_label', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_resolver', internalType: 'address', type: 'address' },
      { name: '_ttl', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setSubnodeRecord',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_node', internalType: 'bytes32', type: 'bytes32' },
      { name: '_ttl', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setTTL',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '_node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ttl',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'messageId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'destinationChainSelector', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'receiver', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'message',
        internalType: 'struct CCIPSenderBase.CCIPPayload',
        type: 'tuple',
        components: [
          { name: 'caller', internalType: 'address', type: 'address' },
          { name: 'func', internalType: 'bytes4', type: 'bytes4' },
          { name: 'params', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
      { name: 'fees', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MessageSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'label', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'resolver', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewResolver',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'ttl', internalType: 'uint64', type: 'uint64', indexed: false },
    ],
    name: 'NewTTL',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'Transfer',
  },
] as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0xa3712828a74A413E9538d5eBd6B1eB50446f8287)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x8bb2985caaEf7a336086eeFe3FbD699dfF81d18A)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x65057a6821CC4B4bF848e40789629ebF8879bbce)
 */
export const xcEnsRegistryAddress = {
  420: '0xa3712828a74A413E9538d5eBd6B1eB50446f8287',
  80001: '0x8bb2985caaEf7a336086eeFe3FbD699dfF81d18A',
  84531: '0x65057a6821CC4B4bF848e40789629ebF8879bbce',
} as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0xa3712828a74A413E9538d5eBd6B1eB50446f8287)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x8bb2985caaEf7a336086eeFe3FbD699dfF81d18A)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x65057a6821CC4B4bF848e40789629ebF8879bbce)
 */
export const xcEnsRegistryConfig = { address: xcEnsRegistryAddress, abi: xcEnsRegistryABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xcFIFSRegistrar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0x33C1ce1718227A19a630bca81bf3C04570eCaDd3)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x72a99edfFa6c3502A4EfCf4Bac109A38421295F5)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x261c205DD3E6039919b99FF1CD7CC30956Da41f9)
 */
export const xcFifsRegistrarABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_router', internalType: 'address', type: 'address' },
      { name: '_destinationChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: '_receiverAddress', internalType: 'address', type: 'address' },
      { name: '_feeToken', internalType: 'address', type: 'address' },
    ],
  },
  { stateMutability: 'payable', type: 'receive' },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'destinationChainSelector',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'receiverAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_label', internalType: 'bytes32', type: 'bytes32' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'register',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'router',
    outputs: [{ name: '', internalType: 'contract IRouterClient', type: 'address' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'messageId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'destinationChainSelector', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'receiver', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'message',
        internalType: 'struct CCIPSenderBase.CCIPPayload',
        type: 'tuple',
        components: [
          { name: 'caller', internalType: 'address', type: 'address' },
          { name: 'func', internalType: 'bytes4', type: 'bytes4' },
          { name: 'params', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
      { name: 'fees', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MessageSent',
  },
] as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0x33C1ce1718227A19a630bca81bf3C04570eCaDd3)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x72a99edfFa6c3502A4EfCf4Bac109A38421295F5)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x261c205DD3E6039919b99FF1CD7CC30956Da41f9)
 */
export const xcFifsRegistrarAddress = {
  420: '0x33C1ce1718227A19a630bca81bf3C04570eCaDd3',
  80001: '0x72a99edfFa6c3502A4EfCf4Bac109A38421295F5',
  84531: '0x261c205DD3E6039919b99FF1CD7CC30956Da41f9',
} as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0x33C1ce1718227A19a630bca81bf3C04570eCaDd3)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x72a99edfFa6c3502A4EfCf4Bac109A38421295F5)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x261c205DD3E6039919b99FF1CD7CC30956Da41f9)
 */
export const xcFifsRegistrarConfig = {
  address: xcFifsRegistrarAddress,
  abi: xcFifsRegistrarABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xcPublicResolver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0x9821c860F75b8f166cE68A70cbfc6C01d133CB8C)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0xbeD73164a7dA3b2E58d0A38a485984E648Ae2da9)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0xc07Ac5CD919D84be107790A99C104D46dD43193D)
 */
export const xcPublicResolverABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'coinType', internalType: 'uint256', type: 'uint256' },
      { name: '_router', internalType: 'address', type: 'address' },
      { name: '_destinationChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: '_receiverAddress', internalType: 'address', type: 'address' },
      { name: '_feeToken', internalType: 'address', type: 'address' },
    ],
  },
  { stateMutability: 'payable', type: 'receive' },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'delegate', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'node', internalType: 'bytes32', type: 'bytes32' }],
    name: 'clearRecords',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'destinationChainSelector',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'receiverAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'router',
    outputs: [{ name: '', internalType: 'contract IRouterClient', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'coinType', internalType: 'uint256', type: 'uint256' },
      { name: 'a', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setAddr',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'a', internalType: 'address', type: 'address' },
    ],
    name: 'setAddr',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'interfaceID', internalType: 'bytes4', type: 'bytes4' },
      { name: 'implementer', internalType: 'address', type: 'address' },
    ],
    name: 'setInterface',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'node', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newName', internalType: 'string', type: 'string' },
    ],
    name: 'setName',
    outputs: [],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'messageId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'destinationChainSelector', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'receiver', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'message',
        internalType: 'struct CCIPSenderBase.CCIPPayload',
        type: 'tuple',
        components: [
          { name: 'caller', internalType: 'address', type: 'address' },
          { name: 'func', internalType: 'bytes4', type: 'bytes4' },
          { name: 'params', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
      { name: 'fees', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MessageSent',
  },
] as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0x9821c860F75b8f166cE68A70cbfc6C01d133CB8C)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0xbeD73164a7dA3b2E58d0A38a485984E648Ae2da9)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0xc07Ac5CD919D84be107790A99C104D46dD43193D)
 */
export const xcPublicResolverAddress = {
  420: '0x9821c860F75b8f166cE68A70cbfc6C01d133CB8C',
  80001: '0xbeD73164a7dA3b2E58d0A38a485984E648Ae2da9',
  84531: '0xc07Ac5CD919D84be107790A99C104D46dD43193D',
} as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0x9821c860F75b8f166cE68A70cbfc6C01d133CB8C)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0xbeD73164a7dA3b2E58d0A38a485984E648Ae2da9)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0xc07Ac5CD919D84be107790A99C104D46dD43193D)
 */
export const xcPublicResolverConfig = {
  address: xcPublicResolverAddress,
  abi: xcPublicResolverABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xcReverseRegistrar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0xAd0d86B82C9A4f0616f77C45638838b5615E6dB3)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0xA556A8Fa8d8311F9B39ad9C68EDB63aD906406C4)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x7a36B02ec9Ba1A5399b9e35921D463eE15c67BC8)
 */
export const xcReverseRegistrarABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_router', internalType: 'address', type: 'address' },
      { name: '_destinationChainSelector', internalType: 'uint64', type: 'uint64' },
      { name: '_receiverAddress', internalType: 'address', type: 'address' },
      { name: '_feeToken', internalType: 'address', type: 'address' },
    ],
  },
  { stateMutability: 'payable', type: 'receive' },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'claim',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
    ],
    name: 'claimForAddr',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
    ],
    name: 'claimWithResolver',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'destinationChainSelector',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'node',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'receiverAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'router',
    outputs: [{ name: '', internalType: 'contract IRouterClient', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'resolver', internalType: 'address', type: 'address' }],
    name: 'setDefaultResolver',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'setName',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'resolver', internalType: 'address', type: 'address' },
      { name: 'name', internalType: 'string', type: 'string' },
    ],
    name: 'setNameForAddr',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'messageId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'destinationChainSelector', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'receiver', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'message',
        internalType: 'struct CCIPSenderBase.CCIPPayload',
        type: 'tuple',
        components: [
          { name: 'caller', internalType: 'address', type: 'address' },
          { name: 'func', internalType: 'bytes4', type: 'bytes4' },
          { name: 'params', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
      { name: 'fees', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MessageSent',
  },
] as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0xAd0d86B82C9A4f0616f77C45638838b5615E6dB3)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0xA556A8Fa8d8311F9B39ad9C68EDB63aD906406C4)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x7a36B02ec9Ba1A5399b9e35921D463eE15c67BC8)
 */
export const xcReverseRegistrarAddress = {
  420: '0xAd0d86B82C9A4f0616f77C45638838b5615E6dB3',
  80001: '0xA556A8Fa8d8311F9B39ad9C68EDB63aD906406C4',
  84531: '0x7a36B02ec9Ba1A5399b9e35921D463eE15c67BC8',
} as const

/**
 * - [__View Contract on Optimism Goerli Etherscan__](https://goerli-optimism.etherscan.io/address/0xAd0d86B82C9A4f0616f77C45638838b5615E6dB3)
 * - [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0xA556A8Fa8d8311F9B39ad9C68EDB63aD906406C4)
 * - [__View Contract on Base Goerli Basescan__](https://goerli.basescan.org/address/0x7a36B02ec9Ba1A5399b9e35921D463eE15c67BC8)
 */
export const xcReverseRegistrarConfig = {
  address: xcReverseRegistrarAddress,
  abi: xcReverseRegistrarABI,
} as const
