import { AppConfig } from '@repo/config';
import { TurnkeyApiTypes } from '@turnkey/http';

type TAttestation = TurnkeyApiTypes['v1Attestation'];

type CreateSubOrgWithPrivateKeyRequest = {
    subOrgName: string;
    challenge: string;
    attestation: TAttestation;
    config: AppConfig;
};

type ErrorMessage = {
    message: string;
};

export type { CreateSubOrgWithPrivateKeyRequest, ErrorMessage, TAttestation };
