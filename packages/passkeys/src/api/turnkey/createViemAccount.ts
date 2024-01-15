import { createAccount } from '@turnkey/viem';
import { passkeyHttpClient } from '../../const';
import { LocalAccount } from 'viem';
import { AppConfig } from '@repo/config';

export const createViemAccount = async ({
    config,
    turnkeyRes
}: {
    config: AppConfig;
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
