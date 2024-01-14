import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { TurnkeyClient } from '@turnkey/http';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';

const stamper = new WebauthnStamper({
    rpId: 'localhost'
});

export const passkeyHttpClient = new TurnkeyClient(
    {
        baseUrl: import.meta.env.VITE_TURNKEY_API_BASE_URL!
    },
    stamper
);

export const turnkeyClient = new TurnkeyClient(
    { baseUrl: import.meta.env.VITE_TURNKEY_API_BASE_URL! },
    new ApiKeyStamper({
        apiPublicKey: import.meta.env.VITE_API_PUBLIC_KEY!,
        apiPrivateKey: import.meta.env.VITE_API_PRIVATE_KEY!
    })
);
