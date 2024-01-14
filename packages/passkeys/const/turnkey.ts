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
        apiPublicKey: "VITE_API_PUBLIC_KEY", // TODO replace with real api public key
        apiPrivateKey: "VITE_API_PRIVATE_KEY", // TODO replace with real api private key
    })
);
