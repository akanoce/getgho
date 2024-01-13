import {
  Pool,
  InterestRate,
  EthereumTransactionTypeExtended,
  BaseDebtToken,
  ERC20Service,
} from "@aave/contract-helpers";

import { AaveV3Sepolia } from "@bgd-labs/aave-address-book"; // import specific pool
import { providers } from "ethers";

type BorrowParamsType = {
  user: string;
  amount: string;
  interestRateMode: InterestRate;
  onBehalfOf?: string;
  referralCode?: string;
};
export const createBorrowTxs = async (
  provider: providers.Provider,
  data: BorrowParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const { user, amount, interestRateMode, onBehalfOf, referralCode } = data;
  const pool = new Pool(provider, {
    POOL: AaveV3Sepolia.POOL, // Goerli GHO market
    WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY, // Goerli GHO market
  });

  /*
    - @param `user` The ethereum address that will receive the borrowed amount 
    - @param `reserve` The ethereum address of the reserve asset 
    - @param `amount` The amount to be borrowed, in human readable units (e.g. 2.5 ETH)
    - @param `interestRateMode`//Whether the borrow will incur a stable (InterestRate.Stable) or variable (InterestRate.Variable) interest rate
    - @param @optional `debtTokenAddress` The ethereum address of the debt token of the asset you want to borrow. Only needed if the reserve is ETH mock address 
    - @param @optional `onBehalfOf` The ethereum address for which user is borrowing. It will default to the user address 
    */
  const txs: EthereumTransactionTypeExtended[] = await pool.borrow({
    user,
    reserve: "0xcbE9771eD31e761b744D3cB9eF78A1f32DD99211", // Goerli GHO market
    amount,
    interestRateMode,
    debtTokenAddress: "0x80aa933EfF12213022Fd3d17c2c59C066cBb91c7", // Goerli GHO market
    onBehalfOf,
    referralCode,
  });
  return txs;
};

type ApproveDelegationParamsType = {
  user: string;
  delegatee: string;
  debtTokenAddress: string;
  amount: string;
};
export const createApproveDelegationTx = async (
  provider: providers.Provider,
  data: ApproveDelegationParamsType
): Promise<EthereumTransactionTypeExtended> => {
  const { user, delegatee, debtTokenAddress, amount } = data;
  const delegationServicePolygonV2USDC = new BaseDebtToken(
    provider,
    new ERC20Service(provider) // This parameter will be removed in future utils version
  );

  const approveDelegation = delegationServicePolygonV2USDC.approveDelegation({
    user, /// delegator
    delegatee,
    debtTokenAddress, // can be any V2 or V3 debt token
    amount, // in decimals of underlying token
  });

  return approveDelegation;
};
