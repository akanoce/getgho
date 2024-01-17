import { TurnkeyClient } from '@turnkey/http';
import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { config } from '@repo/config';

export const turnkeyAuthClient = () =>
    new TurnkeyClient(
        { baseUrl: config.turnkeyApiBaseUrl },
        new ApiKeyStamper({
            apiPublicKey: config.turnkeyApiPublicKey,
            apiPrivateKey: config.turnkeyApiPrivateKey
        })
    );
