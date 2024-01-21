import { TurnkeyClient } from '@turnkey/http';
import { config } from '@repo/config';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';

const stamper = new WebauthnStamper({
    rpId: config.baseUrl || 'localhost'
});

export const turnkeyPasskeyClient = () =>
    new TurnkeyClient(
        {
            baseUrl: config.turnkeyApiBaseUrl
        },
        stamper
    );
