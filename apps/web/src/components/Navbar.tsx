import {
    HStack,
    IconButton,
    useColorMode,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';
import { AddressButton } from '.';
import { ConnectedAddressModal } from './ConnectedAddressModal';
import { FaMoon, FaSun } from 'react-icons/fa6';
import { GhostBusters } from './GhostBusters';
import { useAccountAdapter } from '@/hooks/useAccountAdapter';

export const Navbar: React.FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { toggleColorMode } = useColorMode();
    const { account } = useAccountAdapter();

    // const { setIsSPonsored } = useSponsoredTxFlag();

    // const handleOnChange = useCallback(
    //     (event: ChangeEvent<HTMLInputElement>) => {
    //         setIsSPonsored(event.target.checked);
    //     },
    //     [setIsSPonsored]
    // );
    return (
        <HStack
            justifyContent="space-between"
            w="full"
            position={'sticky'}
            top={0}
            left={0}
            py={2}
            px={1}
        >
            {/* <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="sponsored" mb="0">
            Enable ERC20 Sponsored Transactions
        </FormLabel>
        <Switch
            id="sponsored"
            size="lg"
            onChange={handleOnChange}
        />
    </FormControl> */}

            <GhostBusters />
            <HStack spacing={1}>
                {account && (
                    <>
                        <ConnectedAddressModal
                            isOpen={isOpen}
                            onClose={onClose}
                        />
                        <AddressButton
                            onClick={onOpen}
                            address={account}
                            withCopy={false}
                        />
                    </>
                )}
                <IconButton
                    variant={'empty'}
                    aria-label="Mode Change"
                    size="lg"
                    icon={useColorModeValue(<FaMoon />, <FaSun />)}
                    onClick={toggleColorMode}
                />
            </HStack>
        </HStack>
    );
};
