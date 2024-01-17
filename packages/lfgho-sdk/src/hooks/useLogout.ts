import { useCounterFactualAddress, useTurnkeyViem, useViemSigner } from '..';

export const useLogout = () => {
    const { setAddressRecords } = useCounterFactualAddress();
    const { deleteViemAccount } = useTurnkeyViem();
    const { setViemSigner } = useViemSigner();

    const logout = () => {
        deleteViemAccount();
        setAddressRecords(undefined);
        setViemSigner(undefined);
    };

    return logout;
};
