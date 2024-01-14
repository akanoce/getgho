import {
    TurnkeySigner,
    TurnkeySubOrganization,
} from "@alchemy/aa-signers/turnkey";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
import { http } from "viem";
import { createSubOrgAndWallet } from "./api/turnkey";
// import { AlchemyProvider } from "@alchemy/aa-alchemy";
// import {
//     LightSmartContractAccount,
//     getDefaultLightAccountFactoryAddress,
// } from "@alchemy/aa-accounts";
// import { sepolia } from "viem/chains";

export const createTurnkeySigner = async () => {
    const turnkeySigner = new TurnkeySigner({
        apiUrl: "https://api.turnkey.com",
        stamper: new WebauthnStamper({
            rpId: "localhost", // TODO: change to your domain
        }),
    });

    const subOrgResponse = await createSubOrgAndWallet();
    if (!subOrgResponse) return;

    await turnkeySigner.authenticate({
        resolveSubOrganization: async () => {
            return new TurnkeySubOrganization({
                subOrganizationId: subOrgResponse.subOrgId,
                signWith: subOrgResponse.address,
            });
        },
        transport: http(
            `https://eth-sepolia.g.alchemy.com/v2/6bXQIUdwCDCv0j5LccKvKFVHGNR_ODrs`
        ),
    });

    return {
        turnkeySigner,
        wallet: subOrgResponse.address,
        subOrgId: subOrgResponse.subOrgId,
    };
};

// DOCS
// https://accountkit.alchemy.com/smart-accounts/signers/guides/turnkey.html

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
