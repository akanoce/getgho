export const humanReadableDateTime = (): string => {
    return new Date()
        .toLocaleString()
        .replaceAll('/', '-')
        .replaceAll(':', '.');
};
