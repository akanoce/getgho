import { AppConfig } from '@repo/config';
import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { TurnkeyClient } from '@turnkey/http';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';

const stamper = new WebauthnStamper({
    rpId: 'localhost'
});

export const passkeyHttpClient = ({ config }: { config: AppConfig }) =>
    new TurnkeyClient(
        {
            baseUrl: config.turnkeyApiBaseUrl
        },
        stamper
    );

export const turnkeyClient = ({ config }: { config: AppConfig }) =>
    new TurnkeyClient(
        { baseUrl: config.turnkeyApiBaseUrl },
        new ApiKeyStamper({
            apiPublicKey: config.turnkeyApiPublicKey,
            apiPrivateKey: config.turnkeyApiPrivateKey
        })
    );
