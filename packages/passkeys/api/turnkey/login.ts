import axios from "axios";
import { TSignedRequest } from "@turnkey/http";
// import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { turnkeyClient } from "../../const";

export async function turnkeyLogin(signedRequest: TSignedRequest) {
    try {
        const whoamiResponse = await axios.post(
            signedRequest.url,
            signedRequest.body,
            {
                headers: {
                    [signedRequest.stamp.stampHeaderName]:
                        signedRequest.stamp.stampHeaderValue,
                },
            }
        );

        if (whoamiResponse.status !== 200) {
            throw new Error( // TODO: Refine, maybe with toast lib
                `expected 200 when forwarding signed whoami request, got ${whoamiResponse.status}: ${whoamiResponse.data}`
            );
        }

        console.log(whoamiResponse.data);

        const subOrgId = whoamiResponse.data.organizationId;

        const walletsResponse = await turnkeyClient.getWallets({
            organizationId: subOrgId,
        });

        const accountsResponse = await turnkeyClient.getWalletAccounts({
            organizationId: subOrgId,
            walletId: walletsResponse.wallets[0].walletId,
        });

        const walletId = accountsResponse.accounts[0].walletId;
        const walletAddress = accountsResponse.accounts[0].address;

        return {
            id: walletId,
            address: walletAddress,
            subOrgId: subOrgId,
        };
    } catch (e) {
        console.error(e);

        throw new Error(`Something went wrong, caught error: ${e}`); // TODO: Handle error, use toast library
    }
}
