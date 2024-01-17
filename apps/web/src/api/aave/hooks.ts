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

    const enabled = !!poolDataProviderContract && !!chainAddressBook;
    return useQuery({
        queryKey: ['aave', 'reserves'],
        queryFn: async () =>
            enabled
                ? await getReserves(poolDataProviderContract, chainAddressBook)
                : null,
        enabled
    });
};

/**
 * see {@link getUserReserves}
 * @param user
 * @returns
 */
export const useUserReserves = (user?: string) => {
    const { poolDataProviderContract, chainAddressBook } = useAaveContracts();

    const { data: reserves } = useReserves();

    const enabled =
        !!poolDataProviderContract &&
        !!chainAddressBook &&
        !!user &&
        !!reserves;
    return useQuery({
        queryKey: ['aave', 'reserves', user],
        queryFn: async () =>
            enabled
                ? await getUserReserves(
                      poolDataProviderContract,
                      chainAddressBook,
                      user,
                      reserves
                  )
                : null,
        enabled
    });
};

/**
 *  see {@link getReservesIncentives}
 * @returns
 */
export const useReservesIncentives = () => {
    const { incentiveDataProviderContract, chainAddressBook } =
        useAaveContracts();

    const { data: reserves } = useReserves();

    const enabled =
        !!incentiveDataProviderContract && !!chainAddressBook && !!reserves;

    return useQuery({
        queryKey: ['aave', 'reserves', 'incentives'],
        queryFn: async () =>
            enabled
                ? await getReservesIncentives(
                      incentiveDataProviderContract,
                      chainAddressBook,
                      reserves
                  )
                : null,
        enabled
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

    const { data: reserves } = useReserves();
    const { data: reservesIncentives } = useReservesIncentives();
    const { data: userReserves } = useUserReserves(user);

    const enabled =
        !!incentiveDataProviderContract &&
        !!chainAddressBook &&
        !!user &&
        !!reserves &&
        !!reservesIncentives &&
        !!userReserves;

    return useQuery({
        queryKey: ['aave', 'reserves', 'incentives', user],
        queryFn: async () =>
            enabled
                ? await getUserReservesIncentives(
                      incentiveDataProviderContract,
                      chainAddressBook,
                      user,
                      reserves,
                      reservesIncentives,
                      userReserves
                  )
                : null,
        enabled
    });
};
