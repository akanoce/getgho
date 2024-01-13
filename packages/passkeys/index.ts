import {
    TurnkeySigner,
    TurnkeySubOrganization,
} from "@alchemy/aa-signers/turnkey";
import { getWebAuthnAttestation } from "@turnkey/http";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
// import axios from "axios";
import { http } from "viem";

const TURNKEY_BASE_URL = "https://api.turnkey.com";

const base64UrlEncode = (challenge: ArrayBuffer): string => {
    return Buffer.from(challenge)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};

const generateRandomBuffer = (): ArrayBuffer => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return arr.buffer;
};

export const createTurnkeySigner = async () => {
    const turnkeySigner = new TurnkeySigner({
        apiUrl: TURNKEY_BASE_URL,
        stamper: new WebauthnStamper({
            rpId: "localhost", // TODO: change to your domain
        }),
    });

    const challenge = generateRandomBuffer();
    const authenticatorUserId = generateRandomBuffer();
    const publicKey = "public-key";
    const es256 = -7;
    const rs256 = -257;
    const subOrgName = "LFDelegate";

    const attestation = await getWebAuthnAttestation({
        publicKey: {
            authenticatorSelection: {
                residentKey: "preferred",
                requireResidentKey: false,
                userVerification: "preferred",
            },
            rp: {
                id: process.env.NEXT_PUBLIC_RPID!,
                name: "Turnkey Federated Passkey Demo",
            },
            challenge,
            pubKeyCredParams: [
                {
                    type: publicKey,
                    alg: es256,
                },
                {
                    type: publicKey,
                    alg: rs256,
                },
            ],
            user: {
                id: authenticatorUserId,
                name: subOrgName,
                displayName: subOrgName,
            },
        },
    });

    // const res = await axios.post("./api/createSubOrg", {
    //     subOrgName,
    //     attestation,
    //     challenge: base64UrlEncode(challenge),
    // });

    // FAKE
    const res = {
        data: {
            subOrgId: "subOrgId",
            wallet: {
                accounts: [
                    {
                        address: "address",
                        curve: "CURVE_SECP256K1",
                        path: "path",
                        pathFormat: "PATH_FORMAT_BIP32",
                    },
                ],
            },
        },
    };

    // TODO: Fix types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subOrgResponse = res.data as any;

    await turnkeySigner.authenticate({
        resolveSubOrganization: async () => {
            return new TurnkeySubOrganization({
                subOrganizationId: subOrgResponse.subOrgId,
                signWith: subOrgResponse.wallet.accounts[0], // TODO: Maybe wrong
            });
        },
        transport: http(
            `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
    });

    return turnkeySigner;
};

// DOCS
// https://accountkit.alchemy.com/smart-accounts/signers/guides/turnkey.html

// import { AlchemyProvider } from "@alchemy/aa-alchemy";
// import {
//     LightSmartContractAccount,
//     getDefaultLightAccountFactoryAddress,
// } from "@alchemy/aa-accounts";
// import { sepolia } from "viem/chains";

// const chain = sepolia;

// const provider = new AlchemyProvider({
//     apiKey: process.env.ALCHEMY_API_KEY,
//     chain,
// }).connect(
//     (rpcClient) =>
//         new LightSmartContractAccount({
//             entryPointAddress,
//             chain: rpcClient.chain,
//             owner: await createTurnkeySigner(),
//             factoryAddress: getDefaultLightAccountFactoryAddress(chain),
//             rpcClient,
//         })
// );

// console.log("PROVIDER", provider);
