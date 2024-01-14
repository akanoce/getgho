import { getWebAuthnAttestation } from '@turnkey/http';
import {
    base64UrlEncode,
    generateRandomBuffer,
    humanReadableDateTime
} from '../../util';
import { turnkeyCreateUser, turnkeyLogin } from '.';
import { passkeyHttpClient } from '../../const';
import { TPasskeysConfig } from '../../model';

export const createSubOrgAndWallet = async ({
    config
}: {
    config: TPasskeysConfig;
}) => {
    try {
        const challenge = generateRandomBuffer();
        const subOrgName = `Passkey Demo - ${humanReadableDateTime()}`;
        const authenticatorUserId = generateRandomBuffer();

        const attestation = await getWebAuthnAttestation({
            publicKey: {
                rp: {
                    id: 'localhost',
                    name: 'Passkey demo' //TODO: Can be replaced with more descriptive name
                },
                challenge,
                pubKeyCredParams: [
                    {
                        type: 'public-key',
                        alg: -7
                    },
                    {
                        type: 'public-key',
                        alg: -257
                    }
                ],
                user: {
                    id: authenticatorUserId,
                    name: subOrgName,
                    displayName: subOrgName
                }
            }
        });

        const res = await turnkeyCreateUser({
            subOrgName: subOrgName,
            attestation,
            challenge: base64UrlEncode(challenge),
            config
        });

        return res;
    } catch (e) {
        //TODO: add toast library
        const message = `caught error: ${(e as Error).message}`;
        console.error(message);
        alert(message); // TODO: replace with toast library
    }
};

export const login = async ({ config }: { config: TPasskeysConfig }) => {
    try {
        // We use the parent org ID, which we know at all times...
        const signedRequest = await passkeyHttpClient({
            config
        }).stampGetWhoami({
            organizationId: config.turnkeyOrganizationId
        });

        console.log(signedRequest);

        // ...to get the sub-org ID, which we don't know at this point because we don't
        // have a DB. Note that we are able to perform this lookup by using the
        // credential ID from the users WebAuthn stamp.
        // In our login endpoint we also fetch wallet details after we get the sub-org ID
        // (our backend API key can do this: parent orgs have read-only access to their sub-orgs)
        return await turnkeyLogin({ signedRequest, config });
    } catch (e) {
        const message = `caught error: ${(e as Error).message}`;
        console.error(message);
        alert(message); // TODO: replace with toast library
    }
};
