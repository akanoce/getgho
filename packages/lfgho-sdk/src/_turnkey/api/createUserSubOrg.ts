import { createActivityPoller } from '@turnkey/http';
import { turnkeyAuthClient } from '.';
import { ETHEREUM_WALLET_DEFAULT_PATH } from '../const';
import { TurnkeyApiTypes } from '@turnkey/http';
import { config } from '@repo/config';
import { refineNonNull } from '..';

type TAttestation = TurnkeyApiTypes['v1Attestation'];
type CreateSubOrgWithPrivateKeyRequest = {
    subOrgName: string;
    challenge: string;
    attestation: TAttestation;
};

type ErrorMessage = {
    message: string;
};

export type { CreateSubOrgWithPrivateKeyRequest, ErrorMessage, TAttestation };

export async function createUserSubOrg(
    subOrgRequest: CreateSubOrgWithPrivateKeyRequest
) {
    try {
        const client = turnkeyAuthClient();
        const activityPoller = createActivityPoller({
            client,
            requestFn: client.createSubOrganization
        });

        const walletName = `Default ETH Wallet`;

        const completedActivity = await activityPoller({
            type: 'ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4',
            timestampMs: String(Date.now()),
            organizationId: config.turnkeyOrganizationId,
            parameters: {
                subOrganizationName: subOrgRequest.subOrgName,
                rootQuorumThreshold: 1,
                rootUsers: [
                    {
                        userName: 'New user',
                        apiKeys: [],
                        authenticators: [
                            {
                                authenticatorName: 'Passkey',
                                challenge: subOrgRequest.challenge,
                                attestation: subOrgRequest.attestation
                            }
                        ]
                    }
                ],
                wallet: {
                    walletName: walletName,
                    accounts: [
                        {
                            curve: 'CURVE_SECP256K1',
                            pathFormat: 'PATH_FORMAT_BIP32',
                            path: ETHEREUM_WALLET_DEFAULT_PATH,
                            addressFormat: 'ADDRESS_FORMAT_ETHEREUM'
                        }
                    ]
                }
            }
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
            subOrgId: subOrgId
        };
    } catch (e) {
        console.error(e);
        throw e; // TODO: Handle error, use toast library
    }
}
