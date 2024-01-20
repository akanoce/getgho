import { TurnkeyClient } from '@turnkey/http';
import { config } from '@repo/config';
import { WebauthnStamper } from '@turnkey/webauthn-stamper';

const stamper = new WebauthnStamper({
    rpId: 'localhost' // TODO - cahnge with url when deployed
});

export const turnkeyPasskeyClient = () =>
    new TurnkeyClient(
        {
            baseUrl: config.turnkeyApiBaseUrl
        },
        stamper
    );
