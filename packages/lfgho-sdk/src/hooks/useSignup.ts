import { getWebAuthnAttestation } from '@turnkey/http';
import {
    base64UrlEncode,
    createUserSubOrg,
    generateRandomBuffer
} from '../_turnkey';
import { useCounterFactualAddress, useViemSigner } from '../store';
import { useTurnkeyViem } from '../hooks';
import { createSmartWallet, getCounterfactualAddresses } from '../_pimlico';
import { useLfghoClients } from '.';

export const useSignup = () => {
    const { createViemInstance } = useTurnkeyViem();
    const { setViemSigner } = useViemSigner();
    const { setAddressRecords } = useCounterFactualAddress();
    const { viemPublicClient, pimlicoBundler, pimlicoPaymaster } =
        useLfghoClients();

    const signup = async (walletName: string) => {
        const challenge = generateRandomBuffer();
        const subOrgName = walletName;
        const authenticatorUserId = generateRandomBuffer();

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

        const { account: viemAccount, signer: viemSigner } =
            await createViemInstance(res);

        // returns the address of the smart account that would be created fron the contract factory
        const { sender, entryPoint, initCode } =
            await getCounterfactualAddresses({
                viemAccount,
                viemPublicClient,
                pimlicoBundler,
                setAddressRecords
            });

        await createSmartWallet({
            viemAccount,
            sender,
            entryPoint,
            viemPublicClient,
            pimlicoBundler,
            initCode,
            pimlicoPaymaster
        });

        setViemSigner(viemSigner);
    };

    return { signup };
};
