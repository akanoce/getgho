import { createAccount } from '@turnkey/viem';
import { LocalAccount } from 'viem';
import { turnkeyPasskeyClient } from '../../_turnkey';

export const createTurnkeyViemAccount = async (turnkeyRes: {
    id: string;
    address: string;
    subOrgId: string;
}): Promise<LocalAccount> => {
    const viemAccount = await createAccount({
        client: turnkeyPasskeyClient(),
        organizationId: turnkeyRes.subOrgId,
        signWith: turnkeyRes.address,
        ethereumAddress: turnkeyRes.address
    });

    return viemAccount;
};
