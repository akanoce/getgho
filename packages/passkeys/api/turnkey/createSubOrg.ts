import { createActivityPoller } from "@turnkey/http";
import { ETHEREUM_WALLET_DEFAULT_PATH, turnkeyClient } from "../../const";
import { CreateSubOrgWithPrivateKeyRequest } from "./types";
import { refineNonNull } from "./helpers";

export async function turnkeyCreateUser(
    subOrgRequest: CreateSubOrgWithPrivateKeyRequest
) {
    try {
        const activityPoller = createActivityPoller({
            client: turnkeyClient,
            requestFn: turnkeyClient.createSubOrganization,
        });

        const walletName = `Default ETH Wallet`;

        const completedActivity = await activityPoller({
            type: "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4",
            timestampMs: String(Date.now()),
            organizationId: "3829e4ce-1c47-44ba-bf2f-69877fee91dd",
            parameters: {
                subOrganizationName: subOrgRequest.subOrgName,
                rootQuorumThreshold: 1,
                rootUsers: [
                    {
                        userName: "New user",
                        apiKeys: [],
                        authenticators: [
                            {
                                authenticatorName: "Passkey",
                                challenge: subOrgRequest.challenge,
                                attestation: subOrgRequest.attestation,
                            },
                        ],
                    },
                ],
                wallet: {
                    walletName: walletName,
                    accounts: [
                        {
                            curve: "CURVE_SECP256K1",
                            pathFormat: "PATH_FORMAT_BIP32",
                            path: ETHEREUM_WALLET_DEFAULT_PATH,
                            addressFormat: "ADDRESS_FORMAT_ETHEREUM",
                        },
                    ],
                },
            },
        });

        const subOrgId = refineNonNull(
            completedActivity.result.createSubOrganizationResultV4
                ?.subOrganizationId
        );
        const wallet = refineNonNull(
            completedActivity.result.createSubOrganizationResultV4?.wallet
        );
        const walletId = wallet.walletId;
        const walletAddress = wallet.addresses[0];

        return {
            id: walletId,
            address: walletAddress,
            subOrgId: subOrgId,
        };
    } catch (e) {
        console.error(e);
        throw e; // TODO: Handle error, use toast library
    }
}
