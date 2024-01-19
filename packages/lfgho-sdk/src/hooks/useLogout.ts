import { useCounterFactualAddress, useLfghoClients } from '..';

export const useLogout = () => {
    const { setAddressRecords } = useCounterFactualAddress();
    const { deleteViemAccount } = useLfghoClients();

    const logout = () => {
        deleteViemAccount();
        setAddressRecords(undefined);
    };

    return logout;
};
