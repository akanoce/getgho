import { useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { LocalAccount, WalletClient } from 'viem';
import { createViemSigner, createTurnkeyViemAccount } from '../_viem';

const LOCAL_STORAGE_KEY = 'lfgho/turnkey-view-account-data';

export type ViemInstance = {
    account: LocalAccount;
    signer: WalletClient;
};

export type CreateTurnkeyViemAccountData = {
    id: string;
    address: string;
    subOrgId: string;
};

const viemCache = {
    instance: undefined as ViemInstance | undefined,
    createAndCacheInstance: async (data: CreateTurnkeyViemAccountData) => {
        const newAccount = await createTurnkeyViemAccount(data);
        viemCache.instance = {
            account: newAccount,
            signer: await createViemSigner(newAccount)
        };
        return viemCache.instance;
    }
};

const setPersistedData = (data: CreateTurnkeyViemAccountData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const resetPersistedData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

const getPersistedData = (): CreateTurnkeyViemAccountData | undefined => {
    const persistedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (persistedData) {
        return JSON.parse(persistedData);
    } else {
        return undefined;
    }
};

export const useTurnkeyViem = (): {
    createViemInstance: (
        data: CreateTurnkeyViemAccountData
    ) => Promise<ViemInstance>;
    deleteViemAccount: () => void;
    getViemInstance: () => Promise<ViemInstance>;
} => {
    const createViemInstance = useCallback(
        async (data: CreateTurnkeyViemAccountData): Promise<ViemInstance> => {
            if (isEqual(data, getPersistedData())) {
                if (viemCache.instance) {
                    return viemCache.instance;
                } else {
                    return await viemCache.createAndCacheInstance(data);
                }
            } else {
                setPersistedData(data);
                return await viemCache.createAndCacheInstance(data);
            }
        },
        []
    );

    const getViemInstance = useCallback(async (): Promise<ViemInstance> => {
        if (viemCache.instance) {
            return viemCache.instance;
        } else {
            const persistedData = getPersistedData();
            if (persistedData) {
                return await viemCache.createAndCacheInstance(persistedData);
            } else {
                throw new Error(
                    'create viem account before calling getViemInstance'
                );
            }
        }
    }, []);

    return {
        getViemInstance,
        createViemInstance,
        deleteViemAccount: () => {
            viemCache.instance = undefined;
            resetPersistedData();
        }
    };
};
