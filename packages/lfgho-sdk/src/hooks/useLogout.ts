import { useCounterFactualAddress, useLocalAccount, useViemSigner } from '..';

export const useLogout = () => {
    const { setAddressRecords } = useCounterFactualAddress();
    const { setLocalAccount } = useLocalAccount();
    const { setViemSigner } = useViemSigner();

    const logout = () => {
        setAddressRecords(undefined);
        setLocalAccount(undefined);
        setViemSigner(undefined);
    };

    return logout;
};
