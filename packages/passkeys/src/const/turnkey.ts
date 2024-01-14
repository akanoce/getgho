import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { TurnkeyClient } from '@turnkey/http';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';
import { TPasskeysConfig } from '../model';

const stamper = new WebauthnStamper({
    rpId: 'localhost'
});

export const passkeyHttpClient = ({ config }: { config: TPasskeysConfig }) =>
    new TurnkeyClient(
        {
            baseUrl: config.turnkeyApiBaseUrl
        },
        stamper
    );

export const turnkeyClient = ({ config }: { config: TPasskeysConfig }) =>
    new TurnkeyClient(
        { baseUrl: config.turnkeyApiBaseUrl },
        new ApiKeyStamper({
            apiPublicKey: config.turnkeyApiPublicKey,
            apiPrivateKey: config.turnkeyApiPrivateKey
        })
    );
