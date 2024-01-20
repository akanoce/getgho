import { config } from '@repo/config';
import {
    base64UrlEncode,
    createUserSubOrg,
    generateRandomBuffer,
    turnkeyLogin,
    turnkeyPasskeyClient
} from '../_turnkey';
import {
    WalletCreationStep,
    useCounterFactualAddress,
    useLfghoClients,
    useWalletCreationStep
} from '..';
import { createSmartWallet, getCounterfactualAddresses } from '../_pimlico';
import { getWebAuthnAttestation } from '@turnkey/http';
import { sepolia } from 'viem/chains';

export const useAuth = () => {
    const {
        viemPublicClient,
        pimlicoBundler,
        createViemInstance,
        deleteViemAccount,
        pimlicoPaymaster
    } = useLfghoClients();

    const { setAddressRecords } = useCounterFactualAddress();
    const { setWalletCreationStep } = useWalletCreationStep();

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

            const { account: viemAccount } = await createViemInstance(res);

            const { sender } = await getCounterfactualAddresses({
                viemAccount,
                viemPublicClient,
                pimlicoBundler
            });

            // Saves smart wallet address to store
            // TODO - this is called every time the user logs in, but it should only be called once OR
            // TODO - it should not save the same address twice
            setAddressRecords({ [sepolia.id]: sender });
        } catch (e) {
            const message = `caught error: ${(e as Error).message}`;
            console.error(message);
            alert(message); // TODO: replace with toast library
        }
    };

    const logout = () => {
        deleteViemAccount();
        setAddressRecords(undefined);
    };

    const signup = async (walletName: string) => {
        const challenge = generateRandomBuffer();
        const subOrgName = walletName;
        const authenticatorUserId = generateRandomBuffer();

        setWalletCreationStep(WalletCreationStep.CreatingWallet);

        const attestation = await getWebAuthnAttestation({
            publicKey: {
                rp: {
                    id: 'localhost',
                    name: 'LFGHO SDK'
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

        const res = await createUserSubOrg({
            subOrgName: subOrgName,
            attestation,
            challenge: base64UrlEncode(challenge)
        });
        const { account: viemAccount } = await createViemInstance(res);

        // returns the address of the smart account that would be created fron the contract factory
        const { sender, entryPoint, initCode } =
            await getCounterfactualAddresses({
                viemAccount,
                viemPublicClient,
                pimlicoBundler
            });

        // used for UI on onboarding screen
        setWalletCreationStep(WalletCreationStep.DeployingWallet);

        await createSmartWallet({
            viemAccount,
            sender,
            entryPoint,
            viemPublicClient,
            pimlicoBundler,
            initCode,
            pimlicoPaymaster
        });

        // Saves smart wallet address to store
        // TODO - this is called every time the user logs in, but it should only be called once OR
        // TODO - it should not save the same address twice
        setAddressRecords({ [sepolia.id]: sender });

        setWalletCreationStep(WalletCreationStep.Initial);
    };

    return { login, logout, signup };
};
