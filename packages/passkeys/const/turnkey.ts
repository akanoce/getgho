import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { TurnkeyClient } from "@turnkey/http";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";

const stamper = new WebauthnStamper({
    rpId: "localhost",
});

export const passkeyHttpClient = new TurnkeyClient(
    {
        baseUrl: "https://api.turnkey.com",
    },
    stamper
);

export const turnkeyClient = new TurnkeyClient(
    { baseUrl: "https://api.turnkey.com" },
    new ApiKeyStamper({
        apiPublicKey:
            "020f4ffa7b14d281b84b978c51f4cc32b5eded50c8af64a8b996d038e57c01f46c",
        apiPrivateKey:
            "2b64359c0726d32f69bad34994195c5de6ccb86beb5288ff92197df4e8822b80",
    })
);
