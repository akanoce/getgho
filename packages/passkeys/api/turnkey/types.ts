import { TurnkeyApiTypes } from '@turnkey/http';

type TAttestation = TurnkeyApiTypes['v1Attestation'];

type CreateSubOrgWithPrivateKeyRequest = {
    subOrgName: string;
    challenge: string;
    attestation: TAttestation;
};

type ErrorMessage = {
    message: string;
};

export type { CreateSubOrgWithPrivateKeyRequest, ErrorMessage, TAttestation };
