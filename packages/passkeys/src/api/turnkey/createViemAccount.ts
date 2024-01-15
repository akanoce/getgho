import { createAccount } from '@turnkey/viem';
import { passkeyHttpClient } from '../../const';
import { TPasskeysConfig } from '../../model';
import { LocalAccount } from 'viem';

export const createViemAccount = async ({
    config,
    turnkeyRes
}: {
    config: TPasskeysConfig;
    turnkeyRes: {
        id: string;
        address: string;
        subOrgId: string;
    };
}): Promise<LocalAccount> => {
    const viemAccount = await createAccount({
        client: passkeyHttpClient({ config }),
        organizationId: turnkeyRes.subOrgId,
        signWith: turnkeyRes.address,
        ethereumAddress: turnkeyRes.address
    });

    return viemAccount;
};
