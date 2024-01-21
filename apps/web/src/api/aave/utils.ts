import {
    Pool,
    EthereumTransactionTypeExtended,
    BaseDebtToken,
    ERC20Service,
    ApproveDelegationType
} from '@aave/aave-utilities';
import {
    LPBorrowParamsType,
    LPRepayParamsType,
    LPRepayWithATokensType,
    LPSupplyParamsType,
    LPSupplyWithPermitType,
    LPWithdrawParamsType
} from '@aave/aave-utilities/packages/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes';

import { providers } from 'ethers';

/**
 *  Create supply txs for Aave V3 pool
 * @param provider
 * @param data  {user, amount, interestRateMode, onBehalfOf, referralCode}
 * @returns  EthereumTransactionTypeExtended[]
 */
export const createSupplyWithPermitTxs = async (
    pool: Pool,
    data: LPSupplyWithPermitType
): Promise<EthereumTransactionTypeExtended[]> => {
    /*
- @param `user` The ethereum address that will make the deposit
- @param `reserve` The ethereum address of the reserve
- @param `amount` The amount to be deposited
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
    const txs: EthereumTransactionTypeExtended[] =
        await pool.supplyWithPermit(data);
    return txs;
};

/**
 *  Create supply txs for Aave V3 pool
 * @param provider
 * @param data  {user, amount, interestRateMode, onBehalfOf, referralCode}
 * @returns  EthereumTransactionTypeExtended[]
 */
export const createSupplyTxs = async (
    pool: Pool,
    data: LPSupplyParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
    /*
- @param `user` The ethereum address that will make the deposit
- @param `reserve` The ethereum address of the reserve
- @param `amount` The amount to be deposited
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
    const txs: EthereumTransactionTypeExtended[] = await pool.supply(data);
    return txs;
};

/**
 * Create withdraw txs for Aave V3 pool
 * @param provider
 * @param data  {user, amount, interestRateMode, onBehalfOf, referralCode}
 * @returns  EthereumTransactionTypeExtended[]
 *
 */
export const createWithdrawTx = async (
    pool: Pool,
    data: LPWithdrawParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
    const txs = await pool.withdraw(data);
    return txs;
};

/**
 * Create repay txs for Aave V3 pool
 * @param provider
 * @param data  {user, amount, interestRateMode, onBehalfOf, referralCode}
 * @returns  EthereumTransactionTypeExtended[]
 *
 */
export const createRepayTx = async (
    pool: Pool,
    data: LPRepayParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
    const txs = await pool.repay(data);
    return txs;
};

/**
 * Create repay txs for Aave V3 pool using aTokens (using supplied assets)
 * @param provider
 * @param data  {user, amount, interestRateMode, onBehalfOf, referralCode}
 * @returns  EthereumTransactionTypeExtended[]
 *
 */
export const createRepayWithATokens = async (
    pool: Pool,
    data: LPRepayWithATokensType
): Promise<EthereumTransactionTypeExtended[]> => {
    const txs = await pool.repayWithATokens(data);
    return txs;
};

/**
 *  Create borrow txs for Aave V3 pool
 * @param provider
 * @param data  {user, amount, interestRateMode, onBehalfOf, referralCode}
 * @returns  EthereumTransactionTypeExtended[]
 */
export const createBorrowTx = async (
    pool: Pool,
    data: LPBorrowParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
    /*
- @param `user` The ethereum address that will make the deposit
- @param `reserve` The ethereum address of the reserve
- @param `amount` The amount to be deposited
- @param @optional `onBehalfOf` The ethereum address for which user is depositing. It will default to the user address
*/
    const txs: EthereumTransactionTypeExtended[] = await pool.borrow(data);
    return txs;
};

export const createApproveDelegationTx = async (
    provider: providers.Provider,
    data: ApproveDelegationType
): Promise<EthereumTransactionTypeExtended> => {
    const delegationServicePolygonV2USDC = new BaseDebtToken(
        provider,
        new ERC20Service(provider) // This parameter will be removed in future utils version
    );

    const approveDelegation =
        delegationServicePolygonV2USDC.approveDelegation(data);

    return approveDelegation;
};
