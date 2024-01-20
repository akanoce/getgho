import {
    Pool,
    EthereumTransactionTypeExtended,
    BaseDebtToken,
    ERC20Service
} from '@aave/aave-utilities/packages/contract-helpers';
import {
    LPBorrowParamsType,
    LPSupplyParamsType,
    LPSupplyWithPermitType
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
        amount // in decimals of underlying token
    });

    return approveDelegation;
};