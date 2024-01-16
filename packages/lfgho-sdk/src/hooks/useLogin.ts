import { config } from '@repo/config';
import { turnkeyLogin, turnkeyPasskeyClient } from '../_turnkey';
import { createViemAccount, createViemSigner } from '../_viem';
import { getCounterfactualAddresses } from '../_pimlico';
import { useLfghoClients } from '.';
import {
    useCounterFactualAddress,
    useLocalAccount,
    useViemSigner
} from '../store';

export const useLogin = () => {
    const { viemPublicClient, pimlicoBundler } = useLfghoClients();
    const { setAddressRecords } = useCounterFactualAddress();
    const { setLocalAccount } = useLocalAccount();
    const { setViemSigner } = useViemSigner();

    const login = async () => {
        try {
            // We use the parent org ID, which we know at all times...
            const signedRequest = await turnkeyPasskeyClient().stampGetWhoami({
                organizationId: config.turnkeyOrganizationId
            });

            // ...to get the sub-org ID, which we don't know at this point because we don't
            // have a DB. Note that we are able to perform this lookup by using the
            // credential ID from the users WebAuthn stamp.
            // In our login endpoint we also fetch wallet details after we get the sub-org ID
            // (our backend API key can do this: parent orgs have read-only access to their sub-orgs)
            const res = await turnkeyLogin({ signedRequest });

            const viemAccount = await createViemAccount({
                turnkeyRes: res
            });

            const viemSigner = await createViemSigner({
                viemAccount
            });

            await getCounterfactualAddresses({
                viemAccount,
                viemPublicClient,
                pimlicoBundler,
                setAddressRecords
            });

            setLocalAccount(viemAccount);
            setViemSigner(viemSigner);
        } catch (e) {
            const message = `caught error: ${(e as Error).message}`;
            console.error(message);
            alert(message); // TODO: replace with toast library
        }
    };

    return { login };
};