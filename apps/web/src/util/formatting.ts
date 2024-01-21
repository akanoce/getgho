import BigNumber from 'bignumber.js';

export const formatAPY = (apy?: number | string) => {
    return `${(Number(apy ?? 0) * 100).toFixed(2)}%`;
};

export const formatBalance = (balance?: number | string, currency?: string) => {
    const bn = BigNumber(balance ?? 0);
    const isSmall = bn.lt(0.01);
    if (isSmall) {
        return `< 0.01`;
    }
    const fixedDecimals = `${Number(balance ?? 0).toFixed(2)}`;

    if (currency)
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: currency
        }).format(Number(fixedDecimals));

    return fixedDecimals;
};
