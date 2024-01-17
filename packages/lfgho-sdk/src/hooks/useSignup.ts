import { getWebAuthnAttestation } from '@turnkey/http';
import {
    base64UrlEncode,
    createUserSubOrg,
    generateRandomBuffer
} from '../_turnkey';
import {
    useCounterFactualAddress,
    useLocalAccount,
    useViemSigner
} from '../store';
import { createViemAccount, createViemSigner } from '../_viem';
import { createSmartWallet, getCounterfactualAddresses } from '../_pimlico';
import { useLfghoClients } from '.';

export const useSignup = () => {
    const { setLocalAccount } = useLocalAccount();
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

        // THIS WILL CAUSE TO DOUBLE PROMPT FOR PASSKEYS - IT IS NECCESSARY TO CREATE AN ACCOUNT TO CONNECT TO THE SIGNER TO SIGN TRANSACTIONS FOR PIMLICO CONTRACT FACTORY TO DEPLOY THE SMART WALLET
        const viemAccount = await createViemAccount({
            turnkeyRes: res
        });

        const viemSigner = await createViemSigner({
            viemAccount
        });

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
        setLocalAccount(viemAccount);
    };

    return { signup };
};
