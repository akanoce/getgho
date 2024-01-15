import { createAccount } from '@turnkey/viem';
import { TWalletDetails } from '../../model';
import { TurnkeyClient } from '@turnkey/http';

export default async function getAccountFromAuthContext(
    wallet: TWalletDetails,
    client: TurnkeyClient
) {
    const account = await createAccount({
        client: client,
        organizationId: wallet.subOrgId,
        signWith: wallet.address
    });

    return account;
}
