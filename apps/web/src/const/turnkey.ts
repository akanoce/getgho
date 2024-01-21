import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { TurnkeyClient } from '@turnkey/http';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { config } from '@repo/config';

const stamper = new WebauthnStamper({
    rpId: 'localhost'
});

export const passkeyHttpClient = new TurnkeyClient(
    {
        baseUrl: config.turnkeyApiBaseUrl
    },
    stamper
);

export const turnkeyClient = new TurnkeyClient(
    { baseUrl: config.turnkeyApiBaseUrl },
    new ApiKeyStamper({
        apiPublicKey: config.turnkeyApiPublicKey,
        apiPrivateKey: config.turnkeyApiPrivateKey
    })
);
