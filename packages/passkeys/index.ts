import {
    TurnkeySigner,
    TurnkeySubOrganization,
} from "@alchemy/aa-signers/turnkey";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
import { HttpTransport, http } from "viem";
import { createSubOrgAndWallet } from "./api/turnkey";
import { TPasskeysConfig } from "./model";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";

const createTurnkeySigner = async ({ config }: { config: TPasskeysConfig }) => {
    const turnkeySigner = new TurnkeySigner({
        apiUrl: config.VITE_TURNKEY_API_BASE_URL,
        stamper: new WebauthnStamper({
            rpId: "localhost", // TODO: change to your domain
        }),
    });

    console.log("turnkeySigner", turnkeySigner);

    const subOrgResponse = await createSubOrgAndWallet({ config });
    console.log("subOrgResponse", subOrgResponse);

    if (!subOrgResponse) return;

    await turnkeySigner.authenticate({
        resolveSubOrganization: async () => {
            return new TurnkeySubOrganization({
                subOrganizationId: subOrgResponse.subOrgId,
                signWith: subOrgResponse.address,
            });
        },
        transport: http(
            `https://eth-sepolia.g.alchemy.com/v2/${config.VITE_ALCHEMY_KEY}`
        ),
    });

    return turnkeySigner;
};

// DOCS
// https://accountkit.alchemy.com/smart-accounts/signers/guides/turnkey.html

type TProviderWithSigner = AlchemyProvider & {
    account: LightSmartContractAccount<HttpTransport>;
};

export const getProviderWithSigner = async ({
    config,
}: {
    config: TPasskeysConfig;
}): Promise<TProviderWithSigner | undefined> => {
    const signer = await createTurnkeySigner({ config });
    if (!signer) return;

    return new AlchemyProvider({
        apiKey: config.VITE_ALCHEMY_KEY,
        chain: config.CHAIN,
    }).connect(
        (rpcClient) =>
            new LightSmartContractAccount({
                chain: rpcClient.chain,
                owner: signer,
                factoryAddress: getDefaultLightAccountFactoryAddress(
                    config.CHAIN
                ),
                rpcClient,
            })
    );
};

export type { TPasskeysConfig, TProviderWithSigner };
