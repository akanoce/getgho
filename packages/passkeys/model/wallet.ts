/**
 * Wallet details when creating a subOrg with Turnkey.
 * Used to save the state of the wallet when creating or logging in to a subOrg.
 */
export type TWalletDetails = {
    id: string;
    address: string;
    subOrgId: string;
};
