import { TurnkeyApiTypes } from "@turnkey/http";
import { TPasskeysConfig } from "../..";

type TAttestation = TurnkeyApiTypes["v1Attestation"];

type CreateSubOrgWithPrivateKeyRequest = {
    subOrgName: string;
    challenge: string;
    attestation: TAttestation;
    config: TPasskeysConfig;
};

type ErrorMessage = {
    message: string;
};

export type { CreateSubOrgWithPrivateKeyRequest, ErrorMessage, TAttestation };
