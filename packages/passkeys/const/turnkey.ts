import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { TurnkeyClient } from "@turnkey/http";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";
import { TPasskeysConfig } from "..";

const stamper = new WebauthnStamper({
    rpId: "localhost",
});

export const passkeyHttpClient = ({ config }: { config: TPasskeysConfig }) =>
    new TurnkeyClient(
        {
            baseUrl: config.VITE_TURNKEY_API_BASE_URL,
        },
        stamper
    );

export const turnkeyClient = ({ config }: { config: TPasskeysConfig }) =>
    new TurnkeyClient(
        { baseUrl: config.VITE_TURNKEY_API_BASE_URL },
        new ApiKeyStamper({
            apiPublicKey: config.VITE_API_PUBLIC_KEY,
            apiPrivateKey: config.VITE_API_PRIVATE_KEY,
        })
    );
