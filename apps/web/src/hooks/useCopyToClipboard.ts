import { useCallback, useEffect, useState } from 'react';

export const useCopyToClipboard = (resetStateAfterTimeout: number = 1000) => {
    const [isCopied, setIsCopied] = useState(false);
    const copy = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
    }, []);

    useEffect(() => {
        if (isCopied && resetStateAfterTimeout) {
            console.log({ isCopied });
            const timeout = setTimeout(
                () => setIsCopied(false),
                resetStateAfterTimeout
            );
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isCopied, resetStateAfterTimeout]);

    return { isCopied, copy };
};
