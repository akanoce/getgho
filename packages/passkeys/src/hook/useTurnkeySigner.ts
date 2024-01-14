import { useCallback, useMemo } from 'react';
import { TWalletDetails, TPasskeysConfig } from '../model';
import {
    base64UrlEncode,
    generateRandomBuffer,
    humanReadableDateTime
} from '../util';
import { getWebAuthnAttestation } from '@turnkey/http';
import { passkeyHttpClient } from '../const';
import { turnkeyCreateUser, turnkeyLogin } from '../api/turnkey';
import { createAccount } from '@turnkey/viem';
import { Transport, WalletClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { useWallet, useSigner } from '../store';
import { ethers } from 'ethers';

export function clientToProvider(client: WalletClient) {
    const { chain, transport } = client;
    if (!chain) throw new Error('Chain not found');
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
    };
    if (transport.type === 'fallback')
        return new ethers.providers.FallbackProvider(
            (transport.transports as ReturnType<Transport>[]).map(
                ({ value }) =>
                    new ethers.providers.JsonRpcProvider(value?.url, network)
            )
        );
    return new ethers.providers.JsonRpcProvider(
        { url: transport.url, headers: transport.fetchOptions.headers },
        network
    );
}

type UseTurnkeySignerReturn = {
    wallet: TWalletDetails | undefined;
    signer: WalletClient | undefined; // Replace with the correct type from viem
    createSubOrgAndWallet: () => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    ethersProvider?:
        | ethers.providers.FallbackProvider
        | ethers.providers.JsonRpcProvider;
};

/**
 * Custom hook for Turnkey Viem+Passkey.
 *
 * @returns {wallet, signer, createSubOrgAndWallet, login}
 */
export const useTurnkeySigner = (
    config: TPasskeysConfig
): UseTurnkeySignerReturn => {
    const { wallet, setWallet } = useWallet();
    const { signer, setSigner } = useSigner();

    const ethersProvider = useMemo(() => {
        if (!signer) return undefined;
        return clientToProvider(signer);
    }, [signer]);

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
                challenge: base64UrlEncode(challenge),
                config: config
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
            const signedRequest = await passkeyHttpClient({
                config
            }).stampGetWhoami({
                organizationId: config.turnkeyOrganizationId
            });

            // ...to get the sub-org ID, which we don't know at this point because we don't
            // have a DB. Note that we are able to perform this lookup by using the
            // credential ID from the users WebAuthn stamp.
            // In our login endpoint we also fetch wallet details after we get the sub-org ID
            // (our backend API key can do this: parent orgs have read-only access to their sub-orgs)
            const res = await turnkeyLogin({ signedRequest, config });

            setWallet(res);

            const viemAccount = await createAccount({
                client: passkeyHttpClient({ config }),
                organizationId: res.subOrgId,
                signWith: res.address,
                ethereumAddress: res.address
            });

            //authenticate to alchemy rpc
            const transport = http(`${sepolia.rpcUrls.alchemy.http[0]}`, {
                fetchOptions: {
                    headers: {
                        Authorization: `Bearer ${config.alchemyApiKey}`
                    }
                }
            });

            // Viem Client (https://viem.sh/docs/ethers-migration#signers--accounts)
            const viemClient = createWalletClient({
                account: viemAccount,
                chain: sepolia,
                transport: transport
            });

            setSigner(viemClient);
        } catch (e) {
            const message = `caught error: ${(e as Error).message}`;
            console.error(message);
            alert(message); // TODO: replace with toast library
        }
    };

    const logout = useCallback(async () => {
        setWallet(undefined);
        setSigner(undefined);
    }, []);

    return {
        wallet,
        signer,
        createSubOrgAndWallet,
        login,
        logout,
        ethersProvider
    };
};
