import { useState } from 'react';
import { TWalletDetails } from '../model';
import {
    base64UrlEncode,
    generateRandomBuffer,
    humanReadableDateTime
} from '../util';
import { getWebAuthnAttestation } from '@turnkey/http';
import { passkeyHttpClient } from '../const';
import { turnkeyCreateUser, turnkeyLogin } from '../api';

/**
 * Custom hook for Turnkey Viem+Passkey.
 *
 * @returns {wallet, createSubOrgAndWallet, login}
 */
export const useTurnkey = () => {
    const [wallet, setWallet] = useState<TWalletDetails>();

    const createSubOrgAndWallet = async () => {
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
                challenge: base64UrlEncode(challenge)
            });

            setWallet(res);
        } catch (e) {
            //TODO: add toast library
            const message = `caught error: ${(e as Error).message}`;
            console.error(message);
            alert(message); // TODO: replace with toast library
        }
    };

    const login = async () => {
        try {
            // We use the parent org ID, which we know at all times...
            const signedRequest = await passkeyHttpClient.stampGetWhoami({
                organizationId: import.meta.env.VITE_ORGANIZATION_ID!
            });

            console.log(signedRequest);

            // ...to get the sub-org ID, which we don't know at this point because we don't
            // have a DB. Note that we are able to perform this lookup by using the
            // credential ID from the users WebAuthn stamp.
            // In our login endpoint we also fetch wallet details after we get the sub-org ID
            // (our backend API key can do this: parent orgs have read-only access to their sub-orgs)
            const res = await turnkeyLogin(signedRequest);

            setWallet(res);
        } catch (e) {
            const message = `caught error: ${(e as Error).message}`;
            console.error(message);
            alert(message); // TODO: replace with toast library
        }
    };

    return { wallet, createSubOrgAndWallet, login };
};
