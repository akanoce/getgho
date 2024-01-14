import { useAaveContracts } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import {
    getReserves,
    getReservesIncentives,
    getUserReserves,
    getUserReservesIncentives
} from '.';

/**
 * see {@link getReserves}
 * @returns
 */
export const useReserves = () => {
    const { poolDataProviderContract, chainAddressBook } = useAaveContracts();

    return useQuery({
        queryKey: ['aave', 'reserves'],
        queryFn: async () =>
            !!poolDataProviderContract &&
            (await getReserves(poolDataProviderContract, chainAddressBook)),
        enabled: !!poolDataProviderContract && !!chainAddressBook
    });
};

/**
 * see {@link getUserReserves}
 * @param user
 * @returns
 */
export const useUserReserves = (user?: string) => {
    const { poolDataProviderContract, chainAddressBook } = useAaveContracts();

    return useQuery({
        queryKey: ['aave', 'reserves', user],
        queryFn: async () =>
            !!poolDataProviderContract &&
            user &&
            (await getUserReserves(
                poolDataProviderContract,
                chainAddressBook,
                user
            )),
        enabled: !!poolDataProviderContract && !!chainAddressBook && !!user
    });
};

/**
 *  see {@link getReservesIncentives}
 * @returns
 */
export const useReservesIncentives = () => {
    const { incentiveDataProviderContract, chainAddressBook } =
        useAaveContracts();

    return useQuery({
        queryKey: ['aave', 'reserves', 'incentives'],
        queryFn: async () =>
            !!incentiveDataProviderContract &&
            (await getReservesIncentives(
                incentiveDataProviderContract,
                chainAddressBook
            )),
        enabled: !!incentiveDataProviderContract && !!chainAddressBook
    });
};

/**
 * see {@link getUserReservesIncentives}
 * @param user  The user's ethereum address
 * @returns
 */
export const useUserReservesIncentives = (user?: string) => {
    const { incentiveDataProviderContract, chainAddressBook } =
        useAaveContracts();

    return useQuery({
        queryKey: ['aave', 'reserves', 'incentives', user],
        queryFn: async () =>
            !!incentiveDataProviderContract &&
            user &&
            (await getUserReservesIncentives(
                incentiveDataProviderContract,
                chainAddressBook,
                user
            )),
        enabled: !!incentiveDataProviderContract && !!chainAddressBook && !!user
    });
};
