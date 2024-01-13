// import {
//     TurnkeyApiTypes,
//     TurnkeyClient,
//     createActivityPoller,
// } from "@turnkey/http";
// import { ApiKeyStamper } from "@turnkey/api-key-stamper";

// type TAttestation = TurnkeyApiTypes["v1Attestation"];

// const TURNKEY_BASE_URL = "https://api.turnkey.com";

// export type TFormattedWalletAccount = {
//     address: string;
//     path: string;
// };

// // type TFormattedWallet = {
// //     id: string;
// //     name: string;
// //     accounts: TFormattedWalletAccount[];
// // };

// // type CreateSubOrgResponse = {
// //     subOrgId: string;
// //     wallet: TFormattedWallet;
// // };

// type CreateSubOrgRequest = {
//     subOrgName: string;
//     challenge: string;
//     attestation: TAttestation;
// };

// // type ErrorMessage = {
// //     message: string;
// // };

// // Default path for the first Ethereum address in a new HD wallet.
// // See https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki, paths are in the form:
// //     m / purpose' / coin_type' / account' / change / address_index
// // - Purpose is a constant set to 44' following the BIP43 recommendation.
// // - Coin type is set to 60 (ETH) -- see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
// // - Account, Change, and Address Index are set to 0
// const ETHEREUM_WALLET_DEFAULT_PATH = "m/44'/60'/0'/0/0";

// export default async function createUser(
//     // TODO: Fix types
//     // req: NextApiRequest,
//     // res: NextApiResponse<CreateSubOrgResponse | ErrorMessage>

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     req: any,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     res: any
// ) {
//     const createSubOrgRequest = req.body as CreateSubOrgRequest;

//     const turnkeyClient = new TurnkeyClient(
//         { baseUrl: TURNKEY_BASE_URL },
//         new ApiKeyStamper({
//             apiPublicKey:
//                 "020f4ffa7b14d281b84b978c51f4cc32b5eded50c8af64a8b996d038e57c01f46c",
//             apiPrivateKey:
//                 "2b64359c0726d32f69bad34994195c5de6ccb86beb5288ff92197df4e8822b80",
//         })
//     );

//     const activityPoller = createActivityPoller({
//         client: turnkeyClient,
//         requestFn: turnkeyClient.createSubOrganization,
//     });

//     try {
//         const walletName = `Default Wallet`;

//         const completedActivity = await activityPoller({
//             type: "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4",
//             timestampMs: String(Date.now()),
//             organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
//             parameters: {
//                 subOrganizationName: createSubOrgRequest.subOrgName,
//                 rootQuorumThreshold: 1,
//                 rootUsers: [
//                     {
//                         userName: "New user",
//                         apiKeys: [],
//                         authenticators: [
//                             {
//                                 authenticatorName: "Passkey",
//                                 challenge: createSubOrgRequest.challenge,
//                                 attestation: createSubOrgRequest.attestation,
//                             },
//                         ],
//                     },
//                 ],
//                 wallet: {
//                     walletName,
//                     accounts: [
//                         {
//                             curve: "CURVE_SECP256K1",
//                             pathFormat: "PATH_FORMAT_BIP32",
//                             path: ETHEREUM_WALLET_DEFAULT_PATH,
//                             addressFormat: "ADDRESS_FORMAT_ETHEREUM",
//                         },
//                     ],
//                 },
//             },
//         });

//         const subOrgId = refineNonNull(
//             completedActivity.result.createSubOrganizationResultV4
//                 ?.subOrganizationId
//         );
//         const wallet = refineNonNull(
//             completedActivity.result.createSubOrganizationResultV4?.wallet
//         );
//         const walletAddress = wallet.addresses?.[0];

//         res.status(200).json({
//             subOrgId: subOrgId,
//             wallet: {
//                 id: wallet.walletId,
//                 name: walletName,
//                 accounts: [
//                     {
//                         address: walletAddress,
//                         path: ETHEREUM_WALLET_DEFAULT_PATH,
//                     },
//                 ],
//             },
//         });
//     } catch (e) {
//         console.error(e);

//         res.status(500).json({
//             message: "Something went wrong.",
//         });
//     }
// }

// function refineNonNull<T>(
//     input: T | null | undefined,
//     errorMessage?: string
// ): T {
//     if (input == null) {
//         throw new Error(errorMessage ?? `Unexpected ${JSON.stringify(input)}`);
//     }

//     return input;
// }
