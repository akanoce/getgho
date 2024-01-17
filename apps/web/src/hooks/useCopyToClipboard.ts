import { useCallback, useState } from 'react';

export const useCopyToClipboard = (resetStateAfterTimeout?: 1000) => {
    const [isCopied, setIsCopied] = useState(false);
    const copy = useCallback(
        (text: string) => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            resetStateAfterTimeout &&
                setTimeout(() => setIsCopied(false), resetStateAfterTimeout);
        },
        [resetStateAfterTimeout]
    );
    return { isCopied, copy };
};
