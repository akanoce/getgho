import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button, Icon } from '@chakra-ui/react';
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
        if (!isCopied) return <Icon as={FaCheck} />;
        return <Icon as={FaCopy} />;
    }, [isCopied]);

    return (
        <Button
            onClick={handleOnClick}
            size="sm"
            display={'flex'}
            gap={2}
            colorScheme="purple"
        >
            {humanizeAddress(address)}
            {withCopy && icon}
        </Button>
    );
};
