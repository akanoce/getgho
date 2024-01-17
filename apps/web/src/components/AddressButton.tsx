import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useMemo } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa6';

type Props = {
    address: string;
    onClick?: () => void;
    withCopy?: boolean;
};

export const AddressButton = ({ address, onClick, withCopy = true }: Props) => {
    const humanizeAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const { isCopied, copy } = useCopyToClipboard();

    const handleOnClick = () => (withCopy ? copy(address) : onClick?.());

    const icon = useMemo(() => {
        if (!isCopied) return <FaCopy />;
        return <FaCheck />;
    }, [isCopied]);
    return (
        <button
            onClick={handleOnClick}
            className="bg-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all text-gray-100 text-sm font-medium px-2.5 py-0.5 rounded flex flex-row gap-2 justify-center items-center"
        >
            {humanizeAddress(address)}
            {icon}
        </button>
    );
};
